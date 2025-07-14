// routes/service.route.js
import express from 'express';
import Service from '../models/service.model.js';

const router = express.Router();

// Get all services (for cards)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({}, 'title shortDescription icon');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single service details
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;