import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary =async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        const response= await cloudinary.uploader.upload(localFilePath,{resource_type: "auto"})
        return response
    } catch (error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async(oldFilePath)=>{
    try{
        if(!oldFilePath) {
            return ( null)
        }
        const publicId = oldFilePath.split("/").pop().split(".")[0];  
        await cloudinary.uploader.destroy(publicId, { invalidate: true });

    } catch (error) {
        console.log("error in deleting old image after updating image ")
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}


