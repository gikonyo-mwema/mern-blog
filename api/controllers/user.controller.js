import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinaryConfig.js';

// Test endpoint to check if API is working
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

// Sign up a new user
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  if (password.length < 6) {
    return next(errorHandler(400, 'Password must be at least 6 characters'));
  }

  if (username.length < 7 || username.length > 20) {
    return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(errorHandler(409, 'Username already taken'));
  }

  try {
    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: '', // Placeholder for default profile picture
    });

    await newUser.save();

    // Exclude password from response
    const { password: pwd, ...userWithoutPassword } = newUser._doc;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// Update user details (with profile picture upload)
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  try {
    const updateData = { ...req.body };

    // Handle profile picture upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
      });
      updateData.profilePicture = result.secure_url;
    }

    // Hash the new password if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      updateData.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: updateData,
    }, { new: true });

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

// Sign out the user
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

// Get a list of users
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
