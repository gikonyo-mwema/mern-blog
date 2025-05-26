import Service from '../models/service.model.js';

export const createService = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      category, 
      price, 
      fullDescription, 
      features, 
      icon 
    } = req.body;

    // Validate required fields
    const requiredFields = {
      title: 'Title',
      description: 'Description',
      category: 'Category',
      price: 'Price',
      fullDescription: 'Full description',
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

    const newService = new Service({
      title,
      description,
      category,
      price: Number(price),
      fullDescription,
      features: features.map(f => f.trim()).filter(f => f !== ''),
      icon: icon || '📋',
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
      search
    } = req.query;

    // Validate pagination parameters
    const parsedLimit = parseInt(limit);
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
        { description: { $regex: search, $options: 'i' } },
        { fullDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const [services, totalServices] = await Promise.all([
      Service.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Service.countDocuments(query)
    ]);

    // Calculate last month's services
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthServices = await Service.countDocuments({
      ...query,
      createdAt: { $gte: lastMonth }
    });

    res.status(200).json({
      success: true,
      services,
      pagination: {
        total: totalServices,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(totalServices / parsedLimit),
        lastMonth: lastMonthServices
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getService = async (req, res, next) => {
  try {
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