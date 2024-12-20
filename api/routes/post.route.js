import express from 'express';
import { getposts } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createImageBitmap)
router.get('/getposts', getpost)


export default router;