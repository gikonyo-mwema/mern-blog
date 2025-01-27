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

const router = express.Router();

// Comment-related routes
router.post('/create', verifyToken, createComment);  // Create a new comment
router.get('/getPostComments/:postId', getPostComments);  // Get comments for a specific post
router.put('/likeComment/:commentId', verifyToken, likeComment);  // Like a comment
router.put('/editComment/:commentId', verifyToken, editComment);  // Edit a comment
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);  // Delete a comment
router.get('/getComments', verifyToken, getComments);  // Fetch all comments

export default router;

