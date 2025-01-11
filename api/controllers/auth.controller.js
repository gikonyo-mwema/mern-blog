import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Utility function for validating email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Utility function for validating password strength
const isStrongPassword = (password) => {
  return password.length >= 8; // Example: Minimum length of 8 characters
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Improved validation for required fields and email format
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }
  if (!isValidEmail(email)) {
    return next(errorHandler(400, 'Invalid email format'));
  }
  if (!isStrongPassword(password)) {
    return next(errorHandler(400, 'Password must be at least 8 characters long'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Signup successful', userId: newUser._id });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Improved validation for required fields
  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }
  
  if (!isValidEmail(email)) {
    return next(errorHandler(400, 'Invalid email format'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    // Token generation with expiration time set to 1 hour
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Improved: Token expiration
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
      
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (user) {
      // Token generation with expiration time set to 1 hour
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Improved: Token expiration
      );
      
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
      
    } else {
      // Improved: Generate a random username based on the user's name
      const generatedUsername =
        name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).slice(-4);
      
      const generatedPassword =
        Math.random().toString(36).slice(-8); // Improved: Simplified random password generation
      
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        username: generatedUsername,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      
      await newUser.save();
      
      // Token generation with expiration time set to 1 hour
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Improved: Token expiration
      );
      
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
      
    }
    
  } catch (error) {
    next(error);
  }
};
