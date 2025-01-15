const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

import express from 'express';
import multer from 'multer';
import cloudinary from './utils/cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();



// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        
        allowed_formats: ['jpg', 'png', 'jpeg']

    }
});

const upload = multer({ storage: storage });



// Define the /upload endpoint
router.post('/upload', upload.single('uploadFile'), (req, res) => {
  try {
    // Cloudinary automatically generates the image URL
    const imageUrl = req.file.path; 
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Failed to upload image', error });
  }
});

export default router;
