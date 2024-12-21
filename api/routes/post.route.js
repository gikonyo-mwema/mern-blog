import express from 'express';
import { getposts } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deletepost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createImageBitmap)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)


export default router;