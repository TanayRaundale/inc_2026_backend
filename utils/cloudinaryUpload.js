import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

async function cloudinaryUpload(fileName,email ) {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           fileName, {
               public_id: email,
           }
       )
       .catch((error) => {
           throw error;
       });
    
    return uploadResult?.secure_url; 
};

export default cloudinaryUpload;