import cloudinary from "../config/cloudinary.config";

export const uploadFiletoCloudinary = async (Filepath : any) => {
        try {
             const result = await cloudinary.uploader.upload(Filepath);
             return {
                image : result.secure_url,
                publicId : result.public_id,
             }   
        } catch (error :any) {
           console.log({message : error.message});
            throw new Error("Error while uploading to coaudinary");
                
        } 
}