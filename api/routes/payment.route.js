import express from 'express';
import {
  initiatePesaPalPayment,
  initiateFlutterwavePayment,
  handlePesaPalIPN,
  handleFlutterwaveWebhook,
  checkPaymentStatus
} from '../controllers/payment.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// Initiate payments
router.post('/pesapal/initiate', verifyUser, initiatePesaPalPayment);
router.post('/flutterwave/initiate', verifyUser, initiateFlutterwavePayment);

// Payment callbacks
router.post('/pesapal/ipn', handlePesaPalIPN);
router.post('/flutterwave/webhook', handleFlutterwaveWebhook);

// Check payment status
router.get('/status/:itemId', verifyUser, checkPaymentStatus);

export default router;