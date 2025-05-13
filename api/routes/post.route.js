import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    create, 
    deletePost, 
    getPosts, 
    updatePost, 
    getTrendingPosts
} from '../controllers/post.controller.js';

const router = express.Router();

// Post-related routes
router.post('/create', verifyToken, create);  // Create new post (image URL in body)
router.get('/getPosts', getPosts);  // Fetch all posts
router.get('/posts/trending', getTrendingPosts); // Get trending posts
router.delete('/deletePost/:postId/:userId', verifyToken, deletePost);  // Delete post
router.put('/updatePost/:postId/:userId', verifyToken, updatePost);  // Update post

// Optional: If you want to keep separate image upload endpoint
// router.post('/upload-image', verifyToken, upload.single('image'), (req, res) => {
//   res.json({ url: req.file.path }); // This would be handled by your upload middleware
// });

export default router;

