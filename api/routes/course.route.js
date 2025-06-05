import express from 'express';
import {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseMetrics,
  migrateCourses
} from '../controllers/course.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getCourses); // Get paginated course list (for cards)
router.get('/slug/:slug', getCourseBySlug); // Get course by slug (for detail page)
router.get('/id/:id', getCourseById); // Get course by ID (admin use)

// Admin routes - require valid token and admin privileges
router.post('/', verifyToken, verifyAdmin, createCourse);
router.put('/:id', verifyToken, verifyAdmin, updateCourse);
router.delete('/:id', verifyToken, verifyAdmin, deleteCourse);

// Metrics and maintenance
router.get('/metrics/dashboard', verifyToken, verifyAdmin, getCourseMetrics);
router.patch('/migrate/legacy', verifyToken, verifyAdmin, migrateCourses);

export default router;