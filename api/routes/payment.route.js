import express from 'express';
import { verifyPayment } from '../controllers/payment.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/verify', verifyUser, verifyPayment);

export default router;