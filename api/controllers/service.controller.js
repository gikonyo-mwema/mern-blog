import Service from '../models/service.model.js';
import { validateServiceData } from '../utils/serviceValidation.js';
import cloneDeep from 'lodash/cloneDeep.js';

export const createService = async (req, res, next) => {
  try {
    // Prepare service data with proper structure
    const serviceData = {
      ...req.body,
      metaTitle: req.body.metaTitle || req.body.title,
      metaDescription: req.body.metaDescription || req.body.shortDescription,
      isFeatured: req.body.isFeatured || false,
      createdBy: req.user.id,
      lastUpdatedBy: req.user.id
    };

    // Handle socialLinks if provided (frontend sends at root level)
    if (req.body.socialLinks) {
      serviceData.contactInfo = {
        ...(req.body.contactInfo || {}),
        socialLinks: req.body.socialLinks
      };
    }

    // Validate input data
    const validation = validateServiceData(serviceData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query, isDeleted: false };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Service.find(JSON.parse(queryStr));

    // Search
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search },
        score: { $meta: "textScore" }
      }).sort({ score: { $meta: "textScore" } });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v -versionHistory');
    }

    // Pagination
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

    if (!service || service.isDeleted) {
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

    // Prepare updates with proper structure
    const serviceUpdates = {
      ...updates,
      lastUpdatedBy: req.user.id,
      updatedAt: new Date()
    };

    // Handle socialLinks if provided
    if (updates.socialLinks) {
      serviceUpdates.contactInfo = {
        ...(updates.contactInfo || {}),
        socialLinks: updates.socialLinks
      };
      delete serviceUpdates.socialLinks;
    }

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
    if (!existingService || existingService.isDeleted) {
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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify service exists and user has permission
    const service = await Service.findById(id);
    if (!service || service.isDeleted) {
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

export const getServiceCategories = async (req, res, next) => {
  try {
    const categories = await Service.distinct('category', { isDeleted: false });
    res.status(200).json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ 
      isFeatured: true,
      isDeleted: false 
    })
    .limit(5)
    .select('title shortDescription price icon category');

    res.status(200).json({
      success: true,
      data: {
        services
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceStats = async (req, res, next) => {
  try {
    const stats = await Service.aggregate([
      {
        $match: { isDeleted: false }
      },
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
      { 
        isPublished: true, 
        lastUpdatedBy: req.user.id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!service || service.isDeleted) {
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
    if (!originalService || originalService.isDeleted) {
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
    delete serviceData.versionHistory;
    
    // Modify the title to indicate it's a copy
    serviceData.title = `Copy of ${serviceData.title}`;
    serviceData.createdBy = req.user.id;
    serviceData.lastUpdatedBy = req.user.id;
    serviceData.isPublished = false;
    serviceData.isFeatured = false;

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

    if (!service || service.isDeleted) {
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
        update = { 
          isPublished: true, 
          lastUpdatedBy: req.user.id,
          updatedAt: new Date()
        };
        message = 'Services published successfully';
        break;
      case 'unpublish':
        update = { 
          isPublished: false, 
          lastUpdatedBy: req.user.id,
          updatedAt: new Date()
        };
        message = 'Services unpublished successfully';
        break;
      case 'feature':
        update = { 
          isFeatured: true, 
          lastUpdatedBy: req.user.id,
          updatedAt: new Date()
        };
        message = 'Services featured successfully';
        break;
      case 'unfeature':
        update = { 
          isFeatured: false, 
          lastUpdatedBy: req.user.id,
          updatedAt: new Date()
        };
        message = 'Services unfeatured successfully';
        break;
      case 'delete':
        update = { 
          isDeleted: true, 
          deletedAt: new Date(), 
          deletedBy: req.user.id 
        };
        message = 'Services marked as deleted successfully';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action specified'
        });
    }

    const result = await Service.updateMany(
      { _id: { $in: ids }, isDeleted: false },
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