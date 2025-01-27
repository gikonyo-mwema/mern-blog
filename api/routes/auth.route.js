import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);  // Register a new user
router.post('/signin', signin);  // Login a user
router.post('/google', google);  // Google OAuth

export default router;

