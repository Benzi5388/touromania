import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'CLOUD_NAME',
  api_key: 'API_KEY',
  api_secret: 'API_Secret'
});

export default cloudinary;

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  export function Cloudinaryupload(images) {
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