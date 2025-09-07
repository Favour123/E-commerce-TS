import { Request, Response, NextFunction } from "express";
import { IUser, ApiResponse } from "../types/user";

export interface AuthRequest extends Request {
   user?: IUser; // now req.user will be the full user object
}
export const isAdmin = (req: AuthRequest, res: Response<ApiResponse<any>>, next: NextFunction) => {
   try {
      if (req.user && req.user.role === "admin") {
         next();
      } else {
         return res.status(403).json({
            success: false,
            message: "Access denied. Admins only.",
         });
      }
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "internal error",
         data: error.message,
      });
   }
};
