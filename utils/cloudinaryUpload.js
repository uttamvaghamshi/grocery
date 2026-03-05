import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // folder name in Cloudinary
        resource_type: "image",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
