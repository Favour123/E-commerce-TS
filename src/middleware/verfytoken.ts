import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload,IUser, ApiResponse } from "../types/user";
import UserModel from "@model/user.model";

const SECRET_KEY = process.env.SECRET_KEY;
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = async (req:Request<AuthRequest,{},IUser>, res: Response<ApiResponse<any>>, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
     if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
    const decoded = jwt.verify(token, SECRET_KEY!) as JwtPayload;
    if (!decoded) {
         return res.status(401).json({
          success:false,
           message: "unaurhorised" 
          });
      }
      const user = await UserModel.findById(decoded.userId).select("-password");

      if (!user) {
         return res.status(401).json({success:false, message: "User not found" });
      }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

