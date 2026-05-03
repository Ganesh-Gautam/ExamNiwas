import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from  "../models/user.model.js"

const getTokenFromRequest = (req) =>
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

export const verifyJWT = asyncHandler(async(req, res, next)=>{
    try {
        const token = getTokenFromRequest(req);
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(401,"Unauthorized request");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

export const requireTeacher = (req, _res, next) => {
    if (req.user?.role !== "teacher") {
        throw new ApiError(403, "Teacher access required");
    }

    next();
};

export const requireStudent = (req, _res, next) => {
    if (req.user?.role !== "student") {
        throw new ApiError(403, "Student access required");
    }

    next();
};
