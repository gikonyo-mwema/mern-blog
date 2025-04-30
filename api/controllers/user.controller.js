import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinaryConfig.js';

// Constants
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
};

// Health check endpoint
export const test = (req, res) => {
  res.status(200).json({ message: 'API is working!' });
};

// Sign up a new user
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields are required'));
    }

    if (password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }

    if (username.length < 7 || username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(409, 'Username already taken'));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: '',
    });

    await newUser.save();

    const { password: pwd, ...userData } = newUser._doc;
    res.status(201).json(userData);
  } catch (err) {
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

    // Upload new profile picture if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
      });
      updateData.profilePicture = upload.secure_url;
    }

    // Hash new password if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User has been deleted' });
  } catch (err) {
    next(err);
  }
};

// Sign out user
export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token', COOKIE_OPTIONS).status(200).json('User has been signed out');
  } catch (err) {
    next(err);
  }
};

// Get all users (admin only)
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortOrder = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortOrder })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map(({ _doc }) => {
      const { password, ...rest } = _doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (err) {
    next(err);
  }
};

// Get single user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, 'User not found'));

    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};
