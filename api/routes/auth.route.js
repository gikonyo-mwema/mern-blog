import express from 'express';
import { google, signin, signout, signup } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);    // Register a new user
router.post('/signin', signin);    // Login a user
router.post('/google', google);    // Google OAuth
router.post('/signout', signout);  // Sign out a user

export default router;