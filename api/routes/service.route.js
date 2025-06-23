import express from 'express';
import { 
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getServiceStats,
  publishService,
  duplicateService,
  getServiceHistory,
  bulkUpdateServices
} from '../controllers/service.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import uploadRouter from '../utils/upload.js'; // Import the upload router

const router = express.Router();

// Use the upload router for image uploads
router.use('/upload', uploadRouter);

// Admin dashboard routes
router.get('/stats', verifyToken, verifyAdmin, getServiceStats);
router.post('/bulk-update', verifyToken, verifyAdmin, bulkUpdateServices);
router.put('/publish/:id', verifyToken, verifyAdmin, publishService);
router.post('/duplicate/:id', verifyToken, verifyAdmin, duplicateService);
router.get('/history/:id', verifyToken, getServiceHistory);

// Regular CRUD routes
router.post('/', 
  verifyToken, 
  // Client should first upload images via /upload endpoint
  // and then include the image URLs in the request body
  createService
);

router.get('/', getServices);
router.get('/:id', getService);

router.put('/:id', 
  verifyToken,
  // Client should first upload new images via /upload endpoint
  // and then include the updated image URLs in the request body
  updateService
);

router.delete('/:id', verifyToken, deleteService);

export default router;