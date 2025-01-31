import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletePost, getPosts, updatePost } from '../controllers/post.controller.js';
import { upload } from '../utils/upload.js'; // Import the upload middleware

const router = express.Router();

// Post-related routes
router.post('/create', verifyToken, upload.single('image'), create);  // Create a new post with an optional image
router.get('/getPosts', getPosts);  // Fetch all posts (supporting query params like limit/pagination)
router.delete('/deletePost/:postId/:userId', verifyToken, deletePost);  // Delete a specific post
router.put('/updatePost/:postId/:userId', verifyToken, upload.single('image'), updatePost);  // Update a post with an optional image

export default router;
