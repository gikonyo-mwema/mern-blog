import Service from '../models/service.model.js';
import { validateServiceData } from '../utils/serviceValidation.js'; 

export const createService = async (req, res, next) => {
  try {
    // Validate input data
    const validation = validateServiceData(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { 
      title,
      shortDescription,
      description,
      fullDescription,
      category,
      price,
      icon,
      heroText,
      processSteps,
      projectTypes,
      benefits,
      contactInfo,
      features,
      isFeatured,
      calendlyLink,
      socialLinks,
      priceNote
    } = req.body;

    const newService = new Service({
      title,
      shortDescription: shortDescription || description.substring(0, 100) + '...',
      description,
      fullDescription: fullDescription || description,
      category,
      price: parseFloat(price) || 0,
      icon: icon || '📋',
      heroText: heroText || `Professional ${title} services`,
      processSteps: processSteps || [],
      projectTypes: projectTypes || [],
      benefits: benefits || [],
      contactInfo: contactInfo || {},
      features: features || [],
      isFeatured: isFeatured || false,
      calendlyLink,
      socialLinks: socialLinks || [],
      priceNote,
      image: req.body.image || '',
      createdBy: req.user.id,
      lastUpdatedBy: req.user.id
    });

    const savedService = await newService.save();
    
    res.status(201).json({
      success: true,
      service: savedService
    });

  } catch (error) {
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
      minPrice,
      maxPrice,
      featured
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOption = { [sort]: order === 'desc' ? -1 : 1 };

    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const [services, totalServices] = await Promise.all([
      Service.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Service.countDocuments(query)
    ]);

    // Calculate statistics
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const stats = await Promise.all([
      Service.countDocuments({
        ...query,
        createdAt: { $gte: lastMonth }
      }),
      Service.aggregate([
        { $match: query },
        { $group: { _id: null, avgPrice: { $avg: "$price" } } }
      ]),
      Service.distinct('category', query)
    ]);

    res.status(200).json({
      success: true,
      services,
      stats: {
        lastMonth: stats[0],
        avgPrice: stats[1][0]?.avgPrice || 0,
        categories: stats[2]
      },
      pagination: {
        total: totalServices,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalServices / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .lean();
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Get related services
    const relatedServices = await Service.find({
      category: service.category,
      _id: { $ne: service._id }
    })
    .limit(3)
    .lean();

    res.status(200).json({
      success: true,
      service,
      relatedServices
    });

  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate updates if provided
    if (Object.keys(updates).length > 0) {
      const validation = validateServiceData(updates, true);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }
    }

    // Verify service exists and user has permission
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is admin or the creator
    if (!req.user.isAdmin && existingService.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    // Prepare updates
    const serviceUpdates = {
      ...updates,
      lastUpdatedBy: req.user.id,
      updatedAt: new Date()
    };

    // Handle array fields properly
    if (updates.processSteps) {
      serviceUpdates.processSteps = updates.processSteps;
    }
    if (updates.projectTypes) {
      serviceUpdates.projectTypes = updates.projectTypes;
    }
    if (updates.benefits) {
      serviceUpdates.benefits = updates.benefits;
    }
    if (updates.features) {
      serviceUpdates.features = updates.features;
    }
    if (updates.socialLinks) {
      serviceUpdates.socialLinks = updates.socialLinks;
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      serviceUpdates,
      { 
        new: true,
        runValidators: true,
        lean: true
      }
    ).populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      success: true,
      service: updatedService
    });

  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify service exists and user has permission
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is admin or the creator
    if (!req.user.isAdmin && service.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    // Soft delete option
    if (process.env.SOFT_DELETE === 'true') {
      await Service.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id
      });
    } else {
      await Service.findByIdAndDelete(id);
    }

    res.status(200).json({
      success: true,
      message: process.env.SOFT_DELETE === 'true' 
        ? 'Service marked as deleted' 
        : 'Service deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Additional controller methods
export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isFeatured: true })
      .limit(6)
      .lean();

    res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceCategories = async (req, res, next) => {
  try {
    const categories = await Service.distinct('category');
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};