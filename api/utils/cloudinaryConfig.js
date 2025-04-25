import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from specific path
dotenv.config({ path: path.resolve(__dirname, '../.env') });


console.log('Loading .env from:', path.resolve(__dirname, '../.env'));
console.log('Current working directory:', process.cwd());
console.log('Environment variables:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***exists***' : 'missing'
});



// Debug logging
console.log('Cloudinary Config Check:', {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '***exists***' : 'missing',
  apiKey: process.env.CLOUDINARY_API_KEY ? '***exists***' : 'missing',
  apiSecret: process.env.CLOUDINARY_API_SECRET ? '***exists***' : 'missing'
});

// Validate Cloudinary environment variables
const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing Cloudinary config: ${missingVars.join(', ')}`);
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('Cloudinary configured successfully');
export default cloudinary;
