import cloudinary from "../config/cloudinary.js";

export const deleteCloudinaryImage = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const public_id = fileName.split(".")[0];

    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log("Cloudinary delete error:", error);
  }
};