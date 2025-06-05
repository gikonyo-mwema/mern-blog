import mongoose from 'mongoose';
import Service from '../models/service.model.js';

export const createService = async (req, res, next) => {
  try {
    const { 
      title,
      shortDescription,
      fullDescription,
      category,
      price,
      features,
      icon,
      calendlyLink,
      contactEmail,
      contactPhone,
      socialLinks,
      meta,
      isFeatured
    } = req.body;

    // Validate required fields
    const requiredFields = {
      title: 'Title',
      shortDescription: 'Short description',
      fullDescription: 'Full description',
      category: 'Category',
      price: 'Price',
      features: 'Features'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !req.body[key])
      .map(([_, value]) => value);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate price is a number
    if (isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number'
      });
    }

    // Validate features is an array with at least one non-empty string
    if (!Array.isArray(features) || features.length === 0 || 
        features.some(f => typeof f !== 'string' || f.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Features must be an array with at least one valid string'
      });
    }

    // Validate email if provided
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate Calendly link if provided
    if (calendlyLink && !/^https:\/\/calendly\.com\//.test(calendlyLink)) {
      return res.status(400).json({
        success: false,
        message: 'Calendly link must start with https://calendly.com/'
      });
    }

    // Validate social links if provided
    if (socialLinks && Array.isArray(socialLinks)) {
      for (const link of socialLinks) {
        if (!link.platform || !link.url) {
          return res.status(400).json({
            success: false,
            message: 'Social links must have platform and url'
          });
        }
      }
    }

    const newService = new Service({
      title,
      shortDescription,
      fullDescription,
      category,
      price: Number(price),
      features: features.map(f => f.trim()).filter(f => f !== ''),
      icon: icon || '📋',
      calendlyLink,
      contactEmail,
      contactPhone,
      socialLinks,
      meta,
      isFeatured: Boolean(isFeatured),
      createdBy: req.user.id
    });

    const savedService = await newService.save();
    
    res.status(201).json({
      success: true,
      service: savedService
    });

  } catch (error) {
    // Handle duplicate key error (unique title)
    if (error.code === 11000 && error.keyPattern?.title) {
      return res.status(400).json({
        success: false,
        message: 'Service with this title already exists'
      });
    }
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const { 
      limit = 9, 
      page = 1, 
      sort = 'createdAt', 
      order = 'desc',
      category,
      search,
      featured,
      minPrice,
      maxPrice
    } = req.query;

    // Validate pagination parameters
    const parsedLimit = Math.min(parseInt(limit), 50);
    const parsedPage = parseInt(page);
    
    if (isNaN(parsedLimit) || parsedLimit < 1 || 
        isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }

    const skip = (parsedPage - 1) * parsedLimit;
    const sortOption = { [sort]: order === 'desc' ? -1 : 1 };

    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { fullDescription: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const [services, totalServices] = await Promise.all([
      Service.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Service.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      services,
      pagination: {
        total: totalServices,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(totalServices / parsedLimit)
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getService = async (req, res, next) => {
  try {
    // Increment view count
    await Service.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    
    const service = await Service.findById(req.params.id).lean();
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }
    next(error);
  }
};

export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    next(error);
  }
};

export const getRelatedServices = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const relatedServices = await Service.find({
      _id: { $ne: service._id },
      category: service.category
    })
    .limit(3)
    .lean();

    res.status(200).json({
      success: true,
      services: relatedServices
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceStats = async (req, res, next) => {
  try {
    const stats = await Service.aggregate([
      {
        $group: {
          _id: null,
          totalServices: { $sum: 1 },
          totalViews: { $sum: "$viewCount" },
          avgPrice: { $avg: "$price" },
          categories: { $addToSet: "$category" }
        }
      },
      {
        $project: {
          _id: 0,
          totalServices: 1,
          totalViews: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          categories: 1
        }
      }
    ]);

    const featuredCount = await Service.countDocuments({ isFeatured: true });
    const popularServices = await Service.find()
      .sort({ viewCount: -1 })
      .limit(3)
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        ...stats[0],
        featuredCount,
        popularServices
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check authorization
    if (!req.user.isAdmin && existingService.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    // Validate updates if they exist
    if (updates.price && isNaN(updates.price)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number'
      });
    }

    if (updates.features && 
        (!Array.isArray(updates.features) || updates.features.length === 0 ||
        updates.features.some(f => typeof f !== 'string' || f.trim() === ''))) {
      return res.status(400).json({
        success: false,
        message: 'Features must be an array with at least one valid string'
      });
    }

    if (updates.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        ...updates,
        ...(updates.price && { price: Number(updates.price) }),
        ...(updates.features && { 
          features: updates.features.map(f => f.trim()).filter(f => f !== '') 
        })
      },
      { 
        new: true,
        runValidators: true,
        lean: true
      }
    );

    res.status(200).json({
      success: true,
      service: updatedService
    });

  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.title) {
      return res.status(400).json({
        success: false,
        message: 'Service with this title already exists'
      });
    }
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify service exists
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check authorization
    if (!req.user.isAdmin && service.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }
    next(error);
  }
};