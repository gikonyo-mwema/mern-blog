import express from 'express';
import multer from 'multer';
import cloudinary from './cloudinaryConfig.js';
import fs from 'fs';

// Configure Multer to store files temporarily in a local folder
const upload = multer({
  dest: 'uploads/', // Temporary folder to store files locally
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const router = express.Router();

// Upload route
router.post('/upload', upload.single('uploadFile'), async (req, res) => {
  try {
    console.log('Received file:', req.file); // Log the file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads', // Cloudinary folder
      transformation: [{ width: 800, height: 800, crop: 'limit' }], // Image resizing
    });

    // Delete the local file after upload
    fs.unlinkSync(req.file.path);

    // Return the Cloudinary URL
    res.status(200).json({ message: 'Image uploaded successfully', url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// Unified error-handling middleware
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Multer error', error: err.message });
  } else if (err) {
    return res.status(500).json({ message: 'Unexpected error', error: err.message });
  }
  next();
};

// Apply error handler
router.use(uploadErrorHandler);

export { upload };
export default router;


