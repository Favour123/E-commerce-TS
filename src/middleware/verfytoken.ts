import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, IUser, ApiResponse } from "../types/user";
import UserModel from "@model/user.model";

const SECRET_KEY = process.env.SECRET_KEY;

export interface AuthRequest extends Request {
  user?: IUser; // now req.user will be the full user object
}

export const authenticate = async (
  req: AuthRequest,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY!) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ fully typed IUser document
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
