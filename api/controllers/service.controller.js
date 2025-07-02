import Service from '../models/service.model.js';
import { validateServiceData } from '../utils/serviceValidation.js';
import cloneDeep from 'lodash/cloneDeep.js';

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

    const serviceData = {
      ...req.body,
      createdBy: req.user.id,
      lastUpdatedBy: req.user.id
    };

    // Handle process steps ordering
    if (serviceData.processSteps) {
      serviceData.processSteps = serviceData.processSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
    }

    const newService = await Service.create(serviceData);
    
    res.status(201).json({
      success: true,
      service: newService
    });

  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    // 1. Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 2. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Service.find(JSON.parse(queryStr));

    // 3. Search
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search },
        score: { $meta: "textScore" }
      }).sort({ score: { $meta: "textScore" } });
    }

    // 4. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 5. Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 6. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const services = await query;
    const total = await Service.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      results: services.length,
      data: {
        services,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
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
      .populate('lastUpdatedBy', 'name email');

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        service
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

    // Handle process steps reordering
    if (updates.processSteps) {
      serviceUpdates.processSteps = updates.processSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      serviceUpdates,
      { 
        new: true,
        runValidators: true
      }
    ).populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: {
        service: updatedService
      }
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

    await Service.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Service marked as deleted'
    });

  } catch (error) {
    next(error);
  }
};

export const getServiceStats = async (req, res, next) => {
  try {
    const stats = await Service.aggregate([
      {
        $facet: {
          totalServices: [{ $count: "count" }],
          publishedServices: [{ $match: { isPublished: true } }, { $count: "count" }],
          draftServices: [{ $match: { isPublished: false } }, { $count: "count" }],
          featuredServices: [{ $match: { isFeatured: true } }, { $count: "count" }],
          byCategory: [
            { $group: { _id: "$category", count: { $sum: 1 } } }
          ],
          recentServices: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { $project: { title: 1, createdAt: 1, isPublished: 1 } }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    next(error);
  }
};

export const publishService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { isPublished: true, lastUpdatedBy: req.user.id },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        service
      }
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const originalService = await Service.findById(id);
    if (!originalService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Create a deep copy of the service
    const serviceData = cloneDeep(originalService.toObject());
    delete serviceData._id;
    delete serviceData.slug;
    delete serviceData.createdAt;
    delete serviceData.updatedAt;
    
    // Modify the title to indicate it's a copy
    serviceData.title = `Copy of ${serviceData.title}`;
    serviceData.createdBy = req.user.id;
    serviceData.lastUpdatedBy = req.user.id;
    serviceData.isPublished = false;

    const newService = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      data: {
        service: newService
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id)
      .select('versionHistory title')
      .populate('versionHistory.changedBy', 'name email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        service: service.title,
        history: service.versionHistory
      }
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateServices = async (req, res, next) => {
  try {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service IDs to update'
      });
    }

    let update;
    let message;

    switch (action) {
      case 'publish':
        update = { isPublished: true, lastUpdatedBy: req.user.id };
        message = 'Services published successfully';
        break;
      case 'unpublish':
        update = { isPublished: false, lastUpdatedBy: req.user.id };
        message = 'Services unpublished successfully';
        break;
      case 'feature':
        update = { isFeatured: true, lastUpdatedBy: req.user.id };
        message = 'Services featured successfully';
        break;
      case 'unfeature':
        update = { isFeatured: false, lastUpdatedBy: req.user.id };
        message = 'Services unfeatured successfully';
        break;
      case 'delete':
        update = { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id };
        message = 'Services marked as deleted successfully';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action specified'
        });
    }

    const result = await Service.updateMany(
      { _id: { $in: ids } },
      update
    );

    res.status(200).json({
      success: true,
      message,
      data: {
        matchedCount: result.n,
        modifiedCount: result.nModified
      }
    });
  } catch (error) {
    next(error);
  }
};