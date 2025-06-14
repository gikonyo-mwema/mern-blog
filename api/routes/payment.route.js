import express from 'express';
import {
  initiatePesaPalPayment,
  initiateFlutterwavePayment,
  handlePesaPalIPN,
  handleFlutterwaveWebhook,
  checkPaymentStatus
} from '../controllers/payment.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; 

const router = express.Router();

// Initiate payments
router.post('/pesapal/initiate', verifyToken , initiatePesaPalPayment);
router.post('/flutterwave/initiate', verifyToken , initiateFlutterwavePayment);

// Payment callbacks
router.post('/pesapal/ipn', handlePesaPalIPN);
router.post('/flutterwave/webhook', handleFlutterwaveWebhook);

// Check payment status
router.get('/status/:itemId', verifyToken, checkPaymentStatus);

export default router;