import express from 'express';
import Course from '../models/course.model.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a course
router.post('/', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const courses = await Course.find().skip(startIndex).limit(limit);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course
router.put('/:id', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course
router.delete('/:id', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

// In your routes file (e.g., routes/course.routes.js)
router.post('/:courseId/payment', verifyToken, async (req, res) => {
  try {
    // Verify payment (in a real app, you'd integrate with M-Pesa API or Stripe)
    const { paymentMethod, phoneNumber } = req.body;
    
    // Process payment (simulated)
    const payment = {
      courseId: req.params.courseId,
      userId: req.user.id,
      amount: req.body.amount,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN-${Date.now()}`
    };
    
    // In a real app, save to database
    // await Payment.create(payment);
    
    // Enroll user in course
    // await User.findByIdAndUpdate(req.user.id, {
    //   $addToSet: { enrolledCourses: req.params.courseId }
    // });
    
    res.status(200).json({ 
      success: true,
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Add these new routes before the export

// Get courses with metrics (for dashboard)
router.get('/metrics', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const totalCourses = await Course.countDocuments();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthCourses = await Course.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    // Get popular courses (example - adjust as needed)
    const popularCourses = await Course.aggregate([
      { $sort: { enrolledCount: -1 } },
      { $limit: 5 },
      { $project: { title: 1, enrolledCount: 1 } }
    ]);

    res.status(200).json({
      totalCourses,
      lastMonthCourses,
      popularCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's purchased courses
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    // In a real implementation, you'd query the user's purchased courses
    // This is a placeholder - adjust based on your User model
    const courses = await Course.find({
      _id: { $in: req.user.purchasedCourses || [] }
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});