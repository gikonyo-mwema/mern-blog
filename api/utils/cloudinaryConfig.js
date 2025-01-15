import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not properly set in .env file.');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Test Cloudinary setup
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('Cloudinary setup error:', error);
    } else {
        console.log('Cloudinary setup successful:', result);
    }
});


export default cloudinary;

