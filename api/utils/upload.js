import express from 'express';
import multer from 'multer';
import cloudinary from './cloudinaryConfig.js';
import fs from 'fs';

const router = express.Router();

// Configure Multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
    cb(null, true);
  },
});

// Upload route
router.post('/upload', upload.single('uploadFile'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received file:', req.file);

    const filePath = req.file.path;

    let result;
    try {
      result = await cloudinary.uploader.upload(filePath, {
        folder: 'uploads',
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.status(500).json({ message: 'Failed to upload to Cloudinary', error: cloudinaryError.message });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting local file:', err);
      }
    });

    return res.status(200).json({ message: 'Image uploaded successfully', url: result.secure_url });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Unified error-handling middleware
router.use((err, req, res, next) => {
  console.error('Error caught in middleware:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Multer error', error: err.message });
  }
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Unexpected error', error: err.message });
});

// Export the router and upload middleware
export { router as default, upload };



