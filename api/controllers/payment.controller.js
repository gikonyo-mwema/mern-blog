import Payment from '../models/payment.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';

export const processPayment = async (req, res, next) => {
  try {
    const { userId, courseId, amount, paymentMethod, phoneNumber, cardDetails } = req.body;
    
    // Validate payment
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      return res.status(400).json({ error: 'M-Pesa phone number required' });
    }

    if (paymentMethod === 'card' && (!cardDetails?.number || !cardDetails?.expiry || !cardDetails?.cvv)) {
      return res.status(400).json({ error: 'Complete card details required' });
    }

    // Create payment record
    const payment = new Payment({
      user: userId,
      course: courseId,
      amount,
      paymentMethod,
      phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : undefined,
      cardDetails: paymentMethod === 'card' ? cardDetails : undefined,
      status: 'completed' // In real app, you'd wait for payment confirmation
    });

    await payment.save();

    // Add course to user's purchased courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedCourses: courseId }
    });

    res.status(201).json(payment);

  } catch (error) {
    next(error);
  }
};

export const getPaymentMetrics = async (req, res, next) => {
  try {
    const metrics = await Payment.getPaymentMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
};