import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import uploadRouter from './utils/upload.js';
import serviceRoutes from './routes/service.route.js';
dotenv.config({ path: './.env' });  


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the api directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Loading .env from:', path.resolve(__dirname, '.env'));



// Initialize environment variables
dotenv.config();

//console.log('All env vars:', Object.keys(process.env));

// Configuration logging
console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '***configured***' : 'missing',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '***configured***' : 'missing'
});

// Initialize Express app
const app = express();
// Removed duplicate declaration of __dirname

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Cloudinary Configuration
const configureCloudinary = () => {
  const requiredCloudinaryVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingVars = requiredCloudinaryVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing Cloudinary configuration:', missingVars.join(', '));
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('Cloudinary configured successfully');
};

// Middleware Setup
const setupMiddleware = () => {
  // Enhanced CORS configuration
  app.use(cors({
    origin: [
      'http://localhost:3000',
      process.env.CLIENT_URL,
      'https://your-production-domain.com'
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '/client/dist')));
};

// Route Setup
const setupRoutes = () => {
  app.use('/api/upload', uploadRouter);
  app.use('/api/user', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/post', postRoutes);
  app.use('/api/comment', commentRoutes);
  app.use('/api/services', serviceRoutes)

  // SPA fallback route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
};

// Error Handling
const setupErrorHandling = () => {
  app.use((err, req, res, next) => {
    console.error('[Error]', {
      path: req.path,
      method: req.method,
      error: err.stack || err.message
    });

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message;

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  });
};

// Server Initialization
const startServer = () => {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('HTTP server closed\nMongoDB connection closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

// Initialize Application
(async () => {
  try {
    await connectDB();
    configureCloudinary();
    setupMiddleware();
    setupRoutes();
    setupErrorHandling();
    startServer();
  } catch (error) {
    console.error('Application initialization failed:', error);
    process.exit(1);
  }
})();