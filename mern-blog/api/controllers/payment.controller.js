import Payment from '../models/payment.model.js';
import Course from '../models/course.model.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Configure payment gateways
const PESAPAL_CONFIG = {
  consumerKey: process.env.PESAPAL_CONSUMER_KEY,
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  baseUrl: process.env.PESAPAL_ENV === 'sandbox' 
    ? 'https://cybqa.pesapal.com/pesapalv3' 
    : 'https://pay.pesapal.com/v3'
};

const FLUTTERWAVE_CONFIG = {
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  baseUrl: process.env.FLUTTERWAVE_ENV === 'sandbox'
    ? 'https://api.flutterwave.com/v3'
    : 'https://api.flutterwave.com/v3'
};

// Helper to generate PesaPal auth token
const getPesaPalToken = async () => {
  try {
    const response = await axios.post(`${PESAPAL_CONFIG.baseUrl}/api/Auth/RequestToken`, {
      consumer_key: PESAPAL_CONFIG.consumerKey,
      consumer_secret: PESAPAL_CONFIG.consumerSecret
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data.token;
  } catch (error) {
    console.error('PesaPal auth error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with PesaPal');
  }
};

// Initiate PesaPal payment
export const initiatePesaPalPayment = async (req, res, next) => {
  try {
    const { itemId, itemType, amount, customer } = req.body;
    const user = req.user;
    
    // Validate item exists
    let item;
    if (itemType === 'course') {
      item = await Course.findById(itemId);
      if (!item) throw new Error('Course not found');
    }
    // Add other item types as needed

    const token = await getPesaPalToken();
    const callbackUrl = `${process.env.FRONTEND_URL}/payment-callback`;
    const notificationId = `${PESAPAL_CONFIG.baseUrl}/api/URLSetup/RegisterIPN`;

    // Register IPN (Instant Payment Notification)
    const ipnResponse = await axios.post(notificationId, {
      url: `${process.env.BACKEND_URL}/api/payments/pesapal/ipn`,
      ipn_notification_type: 'POST'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const paymentData = {
      id: uuidv4(),
      currency: 'KES',
      amount: amount,
      description: `Payment for ${itemType}: ${item.title}`,
      callback_url: callbackUrl,
      notification_id: ipnResponse.data.ipn_id,
      billing_address: {
        email_address: customer.email,
        phone_number: customer.phoneNumber,
        first_name: customer.firstName,
        last_name: customer.lastName
      }
    };

    const response = await axios.post(
      `${PESAPAL_CONFIG.baseUrl}/api/Transactions/SubmitOrderRequest`,
      paymentData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Save payment record
    const payment = new Payment({
      user: user._id,
      itemId,
      itemType,
      amount,
      paymentMethod: 'pesapal',
      reference: paymentData.id,
      status: 'pending',
      paymentDetails: {
        providerResponse: response.data
      }
    });
    await payment.save();

    res.status(200).json({
      redirectUrl: response.data.redirect_url
    });
  } catch (error) {
    next(error);
  }
};

// Initiate Flutterwave payment
export const initiateFlutterwavePayment = async (req, res, next) => {
  try {
    const { itemId, itemType, amount, customer } = req.body;
    const user = req.user;

    // Validate item exists
    let item;
    if (itemType === 'course') {
      item = await Course.findById(itemId);
      if (!item) throw new Error('Course not found');
    }

    const txRef = `FLW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const callbackUrl = `${process.env.BACKEND_URL}/api/payments/flutterwave/webhook`;

    const paymentData = {
      tx_ref: txRef,
      amount,
      currency: 'KES',
      payment_options: 'card,mobilemoney',
      redirect_url: `${process.env.FRONTEND_URL}/payment-success`,
      customer: {
        email: customer.email,
        phonenumber: customer.phoneNumber,
        name: `${customer.firstName} ${customer.lastName}`
      },
      customizations: {
        title: 'MERN Blog Payment',
        description: `Payment for ${itemType}: ${item.title}`,
        logo: `${process.env.FRONTEND_URL}/logo.png`
      },
      meta: {
        itemId,
        itemType,
        userId: user._id
      }
    };

    const response = await axios.post(
      `${FLUTTERWAVE_CONFIG.baseUrl}/payments`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_CONFIG.secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save payment record
    const payment = new Payment({
      user: user._id,
      itemId,
      itemType,
      amount,
      paymentMethod: 'flutterwave',
      reference: txRef,
      status: 'pending',
      paymentDetails: {
        providerResponse: response.data
      }
    });
    await payment.save();

    res.status(200).json({
      paymentUrl: response.data.data.link
    });
  } catch (error) {
    next(error);
  }
};

// Handle PesaPal IPN
export const handlePesaPalIPN = async (req, res, next) => {
  try {
    const { OrderNotificationType, OrderMerchantReference, OrderTrackingId } = req.body;
    
    if (OrderNotificationType === 'IPN') {
      const payment = await Payment.findOne({ reference: OrderMerchantReference });
      if (!payment) return res.status(404).json({ message: 'Payment not found' });

      // Verify payment status with PesaPal
      const token = await getPesaPalToken();
      const statusResponse = await axios.get(
        `${PESAPAL_CONFIG.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      payment.status = statusResponse.data.payment_status_description.toLowerCase();
      payment.paymentDetails.providerStatus = statusResponse.data;
      await payment.save();

      // TODO: Grant user access to the item if payment is completed
    }

    res.status(200).json({ message: 'IPN received' });
  } catch (error) {
    next(error);
  }
};

// Handle Flutterwave Webhook
export const handleFlutterwaveWebhook = async (req, res, next) => {
  try {
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    const signature = req.headers['verif-hash'];
    if (signature !== secretHash) {
      return res.status(401).end();
    }

    const { tx_ref, status, transaction_id } = req.body.data;
    const payment = await Payment.findOne({ reference: tx_ref });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = status === 'successful' ? 'completed' : 'failed';
    payment.transactionId = transaction_id;
    payment.paymentDetails.providerStatus = req.body.data;
    await payment.save();

    // TODO: Grant user access to the item if payment is completed
    res.status(200).end();
  } catch (error) {
    next(error);
  }
};

// Check payment status
export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const payment = await Payment.findOne({ 
      itemId,
      user: req.user._id,
      status: { $in: ['completed', 'failed'] }
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({ message: 'No payment record found' });
    }

    res.status(200).json({
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      completedAt: payment.updatedAt
    });
  } catch (error) {
    next(error);
  }
};