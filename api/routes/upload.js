// Path: mern-blog/api/routes/upload.js

import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'], // Specify allowed formats
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // Optional: Apply transformations
    },
});

const upload = multer({ storage: storage });

// Custom error handling middleware for multer
const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({ message: 'Multer error occurred', error: err.message });
    }
    if (err) {
        console.error('Unknown Error:', err);
        return res.status(500).json({ message: 'Unexpected error occurred', error: err.message });
    }
    next();
};

// Define the /upload endpoint
router.post('/upload', upload.single('uploadFile'), (req, res) => {
    try {
        // Cloudinary automatically generates the image URL
        const imageUrl = req.file.path;
        res.status(200).json({ message: 'Image uploaded successfully', url: imageUrl });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ message: 'Failed to upload image', error });
    }
});

// Apply error-handling middleware
router.use(uploadErrorHandler);

export default router;
