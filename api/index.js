import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';


// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// Initialize Express
const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://ecodeed.co.ke'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import courseRoutes from './routes/course.route.js';
import serviceRoutes from './routes/service.route.js';
import uploadRouter from './utils/upload.js';
import paymentRoutes from './routes/payment.route.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Not Found Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

console.log('Email Config:', {
  user: process.env.EMAIL_USER,
  host: process.env.EMAIL_HOST,
  admin: process.env.ADMIN_EMAIL
});


// Server Startup
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Backend: ${process.env.BACKEND_URL}`);
      console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
      console.log(`🔌 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      
      // Test SMTP connection on startup
      if (process.env.NODE_ENV === 'development') {
        import('./config/email.js').then((testTransporter) => {
          testTransporter.default.verify((error) => {
            if (error) {
              console.log('❌ SMTP Connection Failed');
            } else {
              console.log('📧 SMTP Server Ready');
            }
          });
        }).catch((error) => {
          console.log('❌ Failed to import SMTP transporter:', error);
        });
      }
    });

  } catch (error) {
    console.error('❌ Server Startup Error:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  mongoose.connection.close(() => {
    console.log('💤 MongoDB disconnected');
    process.exit(0);
  });
});

startServer();
