import express from 'express';
import { 
  createService,
  getServices,
  getService,
  updateService,
  deleteService
} from '../controllers/service.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a service
router.post('/', verifyToken, createService);

// Get all services
router.get('/', getServices);

// Get single service
router.get('/:id', getService);

// Update a service
router.put('/:id', verifyToken, updateService);

// Delete a service
router.delete('/:id', verifyToken, deleteService);

export default router;