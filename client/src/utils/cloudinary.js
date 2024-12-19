import dotenv from 'dotenv';
dotenv.config();

export const uploadToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET); // Ensure this is set correctly

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return response.json();
};

  