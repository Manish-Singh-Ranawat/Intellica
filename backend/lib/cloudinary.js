import { ENV_VARS } from "./envVars.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: ENV_VARS.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_VARS.CLOUDINARY_API_KEY,
  api_secret: ENV_VARS.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (image) => {
  const uploadedImage = await cloudinary.uploader.upload(image, {
    folder: "intellica",
  });
  return uploadedImage.secure_url;
};

export const deleteImageFromCloudinary = async (imageUrl) => {
  const urlParts = imageUrl.split("/");
  const folder = urlParts[urlParts.length - 2];
  const imageFile = urlParts[urlParts.length - 1].split(".")[0];
  const publicId = `${folder}/${imageFile}`;
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
