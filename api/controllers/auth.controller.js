import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Utility function to validate email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Utility function to validate password strength
const isStrongPassword = (password) => {
  return password.length >= 8;
};

// SIGNUP CONTROLLER
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  if (!isValidEmail(email)) {
    return next(errorHandler(400, 'Invalid email format'));
  }

  if (!isStrongPassword(password)) {
    return next(errorHandler(400, 'Password must be at least 8 characters long'));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
};

// SIGNIN CONTROLLER
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  if (!isValidEmail(email)) {
    return next(errorHandler(400, 'Invalid email format'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) return next(errorHandler(400, 'Invalid credentials'));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...userData } = user._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

// GOOGLE SIGNIN CONTROLLER
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedUsername = name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).slice(-4);
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username: generatedUsername,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...userData } = user._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};
// SIGNOUT CONTROLLER
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json({ message: 'Signout successful' });
  } catch (error) {
    next(error);
  }
};