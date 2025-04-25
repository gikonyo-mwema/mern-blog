/**
 * Cloudinary Utility Module
 * Handles all Cloudinary image operations including uploads, URL generation, and transformations
 */

// Configuration with fallbacks and validation
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 
             process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_UPLOAD_PRESET || 
               process.env.REACT_APP_UPLOAD_PRESET,
  defaultImage: 'v1745060667/uploads/zsowafnaoebrvrivbca8', // Your default image ID
  defaultFolder: 'blog_uploads'
};

// Validate configuration on load
if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
  console.error('Missing Cloudinary configuration. Please set environment variables:');
  console.error('VITE_CLOUDINARY_CLOUD_NAME or REACT_APP_CLOUDINARY_CLOUD_NAME');
  console.error('VITE_UPLOAD_PRESET or REACT_APP_UPLOAD_PRESET');
}

/**
 * Generates optimized Cloudinary URL with transformations
 * @param {string} imageId - Cloudinary public ID or full URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
export const getCloudinaryUrl = (imageId, options = {}) => {
  const { cloudName, defaultImage } = cloudinaryConfig;
  
  // Default transformations
  const defaultTransformations = {
    quality: 'auto',
    fetchFormat: 'auto',
    width: options.width || null,
    height: options.height || null,
    crop: options.crop || 'limit'
  };

  // Build transformation string
  const transformationString = Object.entries(defaultTransformations)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  // Handle default image case
  if (!imageId) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${defaultImage}`;
  }

  // If already a Cloudinary URL, just optimize it
  if (imageId.includes('res.cloudinary.com')) {
    return imageId.replace('/upload/', `/upload/${transformationString}/`);
  }

  // Handle different ID formats
  const publicId = imageId.startsWith('uploads/') ? 
                 imageId : 
                 `${cloudinaryConfig.defaultFolder}/${imageId}`;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
};

/**
 * Uploads image to Cloudinary
 * @param {File} imageFile - Image file to upload
 * @param {object} options - Upload options
 * @returns {Promise<object>} Upload result with URL and metadata
 */
export const uploadToCloudinary = async (imageFile, options = {}) => {
  const { cloudName, uploadPreset } = cloudinaryConfig;
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is incomplete');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(imageFile.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed');
  }

  // Validate file size (max 5MB)
  if (imageFile.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', options.folder || cloudinaryConfig.defaultFolder);
  
  // Add any additional tags
  if (options.tags) {
    formData.append('tags', options.tags.join(','));
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Image upload failed');
    }

    const data = await response.json();
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    };

  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Deletes image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  const { cloudName } = cloudinaryConfig;
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          invalidate: true
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return await response.json();
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

/**
 * Gets the default image URL with optional transformations
 * @param {object} options - Transformation options
 * @returns {string} Default image URL
 */
export const getDefaultImageUrl = (options = {}) => {
  return getCloudinaryUrl(cloudinaryConfig.defaultImage, options);
};

// Utility for React components
export const Cloudinary = {
  getUrl: getCloudinaryUrl,
  upload: uploadToCloudinary,
  delete: deleteFromCloudinary,
  getDefault: getDefaultImageUrl
};

  