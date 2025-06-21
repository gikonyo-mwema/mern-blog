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
import { uploadServiceImages } from '../utils/upload.js';

const router = express.Router();

// Admin dashboard routes
router.get('/stats', verifyToken, verifyAdmin, getServiceStats);
router.post('/bulk-update', verifyToken, verifyAdmin, bulkUpdateServices);
router.put('/publish/:id', verifyToken, verifyAdmin, publishService);
router.post('/duplicate/:id', verifyToken, verifyAdmin, duplicateService);
router.get('/history/:id', verifyToken, getServiceHistory);

// Regular CRUD routes
router.post('/', 
  verifyToken, 
  uploadServiceImages.array('images', 5),
  createService
);

router.get('/', getServices);
router.get('/:id', getService);

router.put('/:id', 
  verifyToken,
  uploadServiceImages.array('images', 5),
  updateService
);

router.delete('/:id', verifyToken, deleteService);

export default router;