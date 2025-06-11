import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getComments,
  likeComment,
} from '../controllers/comment.controller.js';
import Comment from '../models/comment.model.js'; // Import the Comment model

const router = express.Router();

// Comment-related routes
router.post('/create', verifyToken, createComment);  // Create a new comment
router.get('/getPostComments/:postId', getPostComments);  // Get comments for a specific post
router.put('/likeComment/:commentId', verifyToken, likeComment);  // Like a comment
router.put('/editComment/:commentId', verifyToken, editComment);  // Edit a comment
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);  // Delete a comment

router.get('/getComments', verifyToken, getComments);

// Add pagination endpoint
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
      Comment.find().skip(skip).limit(limit),
      Comment.countDocuments()
    ]);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
