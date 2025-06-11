import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    create, 
    deletePost, 
    getPosts, 
    updatePost, 
    getTrendingPosts 
} from '../controllers/post.controller.js';
import Post from '../models/post.model.js'; // ✅ Import Post model

const router = express.Router();

// Post-related routes
router.post('/create', verifyToken, create);  // Create new post
router.get('/getPosts', getPosts);  // Fetch all posts
router.get('/posts/trending', getTrendingPosts); // Get trending posts
router.delete('/deletePost/:postId/:userId', verifyToken, deletePost);  // Delete post
router.put('/updatePost/:postId/:userId', verifyToken, updatePost);  // Update post

// Pagination endpoint
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find().skip(skip).limit(limit),
      Post.countDocuments()
    ]);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

