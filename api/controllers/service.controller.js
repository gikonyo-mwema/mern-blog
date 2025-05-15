import Service from '../models/service.model.js';

export const createService = async (req, res, next) => {
  try {
    const { title, description, category, price, image } = req.body;
    
    if (!title || !description || !category || !price) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    const newService = new Service({
      title,
      description,
      category,
      price,
      image: image || '',
      createdBy: req.user.id
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
      search
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
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [services, totalServices] = await Promise.all([
      Service.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
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
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalServices / limit),
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
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

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

    const updatedService = await Service.findByIdAndUpdate(
      id,
      updates,
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

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};