import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '/.env') });
console.log(process.env.CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  export function Cloudinaryupload(images) {
    console.log(images);
    return new Promise((resolve, reject) => {
      const uploadPromises = [];
  
      for (const image of images) {
        uploadPromises.push(
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload(image, (error, result) => {
              if (result && result.secure_url) {
                resolve(result);
              } else {
                reject(error);
              }
            });
          })
        );
      }
  
      // Upload all images in parallel
      Promise.all(uploadPromises)
        .then(resolve)
        .catch(reject);
    });
  }