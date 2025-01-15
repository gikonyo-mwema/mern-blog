import 'dotenv/config'; // This will automatically load the .env file
import cloudinary from './utils/cloudinaryConfig.js';

console.log(process.env.CLOUDINARY_CLOUD_NAME); // Should output 'gikonyomwema'


cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('Cloudinary setup error:', error);
    } else {
        console.log('Cloudinary setup successful:', result);
    }
});
