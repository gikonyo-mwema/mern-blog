import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Test route
router.get('/test', test);  // Test endpoint to verify functionality

// User-related routes
router.get('/getUsers', verifyToken, getUsers);  // Fetch all users
router.put('/update/:userId', verifyToken, updateUser);  // Update a user by ID
router.delete('/delete/:userId', verifyToken, deleteUser);  // Delete a user by ID
router.post('/signout', signout);  // Sign out a user

// Dynamic route: Get user by ID (placed last to avoid conflicts)
router.get('/:userId', getUser);

export default router;

