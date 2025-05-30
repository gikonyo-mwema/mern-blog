// Import core modules and dependencies
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url'; 

// Import custom modules and middleware
import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

// Import route handlers
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js'; 
import courseRoutes from './routes/course.route.js';
import serviceRoutes from './routes/service.route.js';
import uploadRouter from './utils/upload.js';
import paymentRoutes from './routes/payment.route.js';

// Setup __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Configure CORS for security and cross-origin requests
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'https://ecodeed-blog.firebaseapp.com',
    process.env.FRONTEND_URL // Allow custom frontend URL from env
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Authorization']
};

// Apply global middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);      // User management
app.use('/api/post', postRoutes);       // Blog posts


app.use('/api/comment', commentRoutes); // Comments

app.use('/api/courses', courseRoutes);  // Courses
app.use('/api/services', serviceRoutes);// Services
app.use('/api/upload', uploadRouter);   // File uploads
app.use('/api/payments', paymentRoutes);// Payment processing

// Health check endpoint for monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files and handle client-side routing in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  // Fallback to index.html for SPA routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware (should be after all routes)
app.use(notFound);      // Handle 404 errors
app.use(errorHandler);  // Handle other errors

// Start the server and connect to DB
const startServer = async () => {
  try {
    await connectDB();           // Connect to MongoDB
    configureCloudinary();       // Configure Cloudinary for uploads

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Listening on http://localhost:${PORT}`);
    });

    // Graceful shutdown on SIGTERM
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💤 Server terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();