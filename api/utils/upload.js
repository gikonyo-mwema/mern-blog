import express from 'express';
import multer from 'multer';
import cloudinary from './cloudinaryConfig.js';
import fs from 'fs';
import { errorHandler } from './error.js';

const router = express.Router();

// Memory storage - avoids temporary files on disk
const storage = multer.memoryStorage();

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
  }

  if (file.size > maxSize) {
    return cb(new Error('File size exceeds 5MB limit'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});

// Standardized upload endpoint
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No image file provided'));
    }

    // Upload to Cloudinary with optimized settings
    const result = await cloudinary.uploader.upload_stream({
      folder: 'post_images',
      format: 'webp',
      transformation: [
        { width: 1200, crop: 'limit' }, // Responsive width
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return next(errorHandler(500, 'Image upload failed'));
      }

      // Return standardized response
      res.status(200).json({
        secureUrl: result.secure_url
          .replace('http://', 'https://')
          .replace('/upload/', '/upload/q_auto,f_auto/')
      });
    }).end(req.file.buffer);

  } catch (error) {
    console.error('Upload processing error:', error);
    next(errorHandler(500, 'Image processing failed'));
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Upload route error:', err);

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File exceeds 5MB limit' 
        : 'Invalid file upload'
    });
  }

  // Handle other errors
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'File upload failed'
  });
});

export default router;