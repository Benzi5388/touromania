import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dspgzmngn',
  api_key: '727446927623469',
  api_secret: '4d3XSJ3rT__tEn_begip2QT04aQ'
});

export default cloudinary;

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

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