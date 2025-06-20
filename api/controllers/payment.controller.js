import axios from 'axios';
import Payment from '../models/payment.model.js';
import Enrollment from '../models/enrollment.model.js'; // Assuming you have this

export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.body;

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, metadata, amount, channel } = response.data.data;

    if (status !== 'success') {
      return next(new ErrorResponse('Payment not confirmed', 400));
    }

    // Save payment record
    const payment = await Payment.create({
      user: metadata.userId,
      course: metadata.courseId,
      amount: amount / 100,
      paymentMethod: channel,
      transactionId: reference,
      status: 'completed',
    });

    // Create enrollment
    await Enrollment.create({
      user: metadata.userId,
      course: metadata.courseId,
      payment: payment._id,
    });

    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};