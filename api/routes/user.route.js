import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';

const router = express.Router();

// Test route
router.get('/test', test);  // Test endpoint to verify functionality

// User-related routes
router.get('/getUsers', verifyToken, getUsers);  // Fetch all users
router.put('/update/:userId', verifyToken, updateUser);  // Update a user by ID
router.delete('/delete/:userId', verifyToken, deleteUser);  // Delete a user by ID
router.post('/signout', signout);  // Sign out a user

// Get user's courses
router.get('/:userId/courses', verifyToken, async (req, res) => {
  try {
    // This should come from your User model's purchasedCourses
    const user = await User.findById(req.params.userId)
      .populate('purchasedCourses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.purchasedCourses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Payment metrics
router.get('/payments/metrics', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthRevenue = await Payment.aggregate([
      { 
        $match: { createdAt: { $gte: lastMonth } } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      totalRevenue: totalRevenue[0]?.total || 0,
      lastMonthRevenue: lastMonthRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dynamic route: Get user by ID (placed last to avoid conflicts)
router.get('/:userId', getUser);

export default router;