import Course from '../models/course.model.js';

/**
 * @desc    Get paginated list of courses (for cards view)
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 9, popular, search } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (popular === 'true') filter.isPopular = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .select('title slug shortDescription price isPopular iconName externalUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      links: {
        next: page * limit < total ? 
          `${req.baseUrl}?page=${parseInt(page)+1}&limit=${limit}` : null,
        prev: page > 1 ? 
          `${req.baseUrl}?page=${parseInt(page)-1}&limit=${limit}` : null
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};

/**
 * @desc    Get single course by slug
 * @route   GET /api/courses/slug/:slug
 * @access  Public
 */
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: course 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private/Admin
 */


/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/id/:id
 * @access  Private/Admin
 */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      data: course 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};



export const createCourse = async (req, res) => {
  try {
    const { slug } = req.body;
    
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ 
        success: false,
        error: 'Slug can only contain lowercase letters, numbers and hyphens' 
      });
    }

    // Check if slug exists
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).json({ 
        success: false,
        error: 'Course with this slug already exists' 
      });
    }

    const course = new Course({
      ...req.body,
      price: parseFloat(req.body.price) // Ensure price is stored as number
    });

    await course.save();
    
    res.status(201).json({ 
      success: true,
      data: course 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 */
export const updateCourse = async (req, res) => {
  try {
    // Prevent slug changes through this endpoint
    if (req.body.slug) {
      return res.status(400).json({
        success: false,
        error: 'Slug cannot be updated through this endpoint'
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: course 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private/Admin
 */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: {} 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};

/**
 * @desc    Get course metrics
 * @route   GET /api/courses/metrics/dashboard
 * @access  Private/Admin
 */
export const getCourseMetrics = async (req, res) => {
  try {
    const [total, popular, lastMonthCount] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ isPopular: true }),
      Course.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCourses: total,
        popularCourses: popular,
        lastMonthAdded: lastMonthCount,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server Error: ' + error.message 
    });
  }
};

/**
 * @desc    Migrate legacy courses (temporary endpoint)
 * @route   PATCH /api/courses/migrate/legacy
 * @access  Private/Admin
 */
export const migrateCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      $or: [
        { slug: { $exists: false } },
        { shortDescription: { $exists: false } },
        { externalUrl: { $exists: false } }
      ]
    });

    if (courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No courses require migration',
        data: { migratedCount: 0 }
      });
    }

    const updates = courses.map(course => ({
      updateOne: {
        filter: { _id: course._id },
        update: {
          $set: {
            slug: course.slug || course.title.toLowerCase().replace(/\s+/g, '-'),
            shortDescription: course.shortDescription || 
              course.description.substring(0, 150),
            externalUrl: course.externalUrl || 
              `https://external-platform.com/courses/${course._id}`,
            iconName: course.iconName || 'HiOutlineAcademicCap'
          }
        }
      }
    }));

    const result = await Course.bulkWrite(updates);
    
    res.status(200).json({
      success: true,
      message: 'Courses migrated successfully',
      data: {
        migratedCount: result.modifiedCount,
        totalCourses: await Course.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Migration Error: ' + error.message 
    });
  }
};