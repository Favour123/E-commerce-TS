import cloudinary from "../config/cloudinary.config";

export interface CloudinaryUploadResult {
  image: string;
  publicId: string;
}

export const uploadFiletoCloudinary = async (filePath: string): Promise<CloudinaryUploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return {
      image: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.error({ message: error.message });
    throw new Error("Error while uploading to Cloudinary");
  }
};
