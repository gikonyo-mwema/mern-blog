import express from 'express';
import { 
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getFeaturedServices,
  getServiceStats,
  getRelatedServices
} from '../controllers/service.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/featured', getFeaturedServices);
router.get('/:id', getService);
router.get('/:id/related', getRelatedServices);

// Protected routes (require authentication)
router.post('/', verifyToken, createService);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

// Admin-only routes (require admin privileges)
router.get('/stats', verifyToken, verifyAdmin, getServiceStats);

export default router;