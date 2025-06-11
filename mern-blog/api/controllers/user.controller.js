import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinaryConfig.js';

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  // Domain should only be set in production
  ...(process.env.NODE_ENV === 'production' && { domain: '.yourdomain.com' })
};

// Health check endpoint
export const test = (req, res) => {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
};

// Sign up a new user
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Enhanced validation
    if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields are required'));
    }

    if (password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }

    if (username.length < 7 || username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return next(errorHandler(400, 'Username can only contain letters, numbers and underscores'));
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return next(errorHandler(400, 'Please enter a valid email address'));
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const conflictField = existingUser.username === username ? 'username' : 'email';
      return next(errorHandler(409, `${conflictField} already exists`));
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 12); // Increased salt rounds
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    });

    await newUser.save();

    // Return user data without password
    const { password: _, ...userData } = newUser._doc;
    res.status(201).json({
      success: true,
      user: userData
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return next(errorHandler(400, errors.join(', ')));
    }
    next(err);
  }
};

// Update user details
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  try {
    const updateData = { ...req.body };

    // Handle profile picture upload
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
        width: 500,
        height: 500,
        crop: 'fill'
      });
      updateData.profilePicture = upload.secure_url;
    }

    // Handle password update
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      updateData.password = bcrypt.hashSync(req.body.password, 12);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { 
        new: true,
        runValidators: true,
        context: 'query' // Ensures proper validation
      }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return next(errorHandler(400, errors.join(', ')));
    }
    next(err);
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    // Additional check for admin privileges
    if (req.user.id === req.params.userId && req.user.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return next(errorHandler(403, 'Cannot delete the last admin account'));
      }
    }

    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'User has been deleted'
    });
  } catch (err) {
    next(err);
  }
};

// Sign out user
export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token', COOKIE_OPTIONS)
      .status(200)
      .json({ 
        success: true,
        message: 'User has been signed out'
      });
  } catch (err) {
    next(err);
  }
};

// Get all users (admin only) with enhanced query
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const searchTerm = req.query.searchTerm || '';

    // Enhanced query building
    const query = {};
    if (searchTerm) {
      query.$or = [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .select('-password -__v');

    // Get counts
    const totalUsers = await User.countDocuments(query);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const lastMonthUsers = await User.countDocuments({
      ...query,
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total: totalUsers,
        lastMonth: lastMonthUsers,
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get single user with enhanced checks
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -__v');

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Enhanced authorization check
    const isAuthorized = req.user.isAdmin || req.user.id === req.params.userId;
    if (!isAuthorized) {
      return next(errorHandler(403, 'Not authorized to view this user'));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(errorHandler(400, 'Invalid user ID'));
    }
    next(err);
  }
};