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

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log('✅ Loaded .env from:', path.resolve(__dirname, '.env'));

const app = express();

// === 1. Database Connection ===
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  }
};

// === 2. Cloudinary Configuration ===
const configureCloudinary = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error('❌ Missing Cloudinary config:', missing.join(', '));
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('✅ Cloudinary configured');
};

// === 3. Middleware Setup ===
const setupMiddleware = () => {
  app.use(cors({
    origin: ['http://localhost:5173', 'https://ecodeed-blog.firebaseapp.com'], // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Static frontend files (for production)
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
};

// === 4. Route Setup ===
const setupRoutes = () => {
  app.use('/api/upload', uploadRouter);
  app.use('/api/user', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/post', postRoutes);
  app.use('/api/comment', commentRoutes);
  app.use('/api/services', serviceRoutes);

  // Catch-all for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
};

// === 5. Error Handling ===
const setupErrorHandling = () => {
  app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack || err.message);

    res.status(err.statusCode || 500).json({
      success: false,
      statusCode: err.statusCode || 500,
      message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  });
};

// === 6. Server Initialization ===
const startServer = () => {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
    console.log(`🛠️  Mode: ${process.env.NODE_ENV || 'development'}`);
  });

  const shutdown = (signal) => {
    console.log(`⚠️  ${signal} received. Closing server...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('🛑 Server and DB closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

// === 7. Run Everything ===
(async () => {
  try {
    await connectDB();
    configureCloudinary();
    setupMiddleware();
    setupRoutes();
    setupErrorHandling();
    startServer();
  } catch (err) {
    console.error('❌ App startup failed:', err);
    process.exit(1);
  }
})();

