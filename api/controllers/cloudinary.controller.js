import { v2 as cloudinary } from 'cloudinary';

// Ensure your environment variables are loaded correctly
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
    throw new Error('CLOUDINARY_URL is not defined');
}

const urlPattern = /^cloudinary:\/\/(\w+):(\w+)@(\w+)$/;
const match = cloudinaryUrl.match(urlPattern);

if (!match) {
    throw new Error('Invalid CLOUDINARY_URL format');
}

const [ , apiKey, apiSecret, cloudName ] = match;
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

/**
 * Generates a signature for Cloudinary uploads.
 * 
 * @param {Object} _ - The request object (unused).
 * @param {Object} res - The response object.
 */
export const generateSignature = (_, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            upload_preset: 'Ecodeed_pictures',
        },
        apiSecret
    );

    res.json({ timestamp, signature });
};

