import UserModel from "@model/user.model";
import { Request, Response } from "express";
import { ApiResponse, IUser, Params } from "../types/user";
import bcrypt from "bcrypt";
import { generateToken } from "@lib/generateToken";

export const getAllUsers = async (req:Request<{},{},IUser>, res:Response<ApiResponse<any>>) => {
   try {
      const users = await UserModel.find().populate('role');
      if(!users){
         res.status(401).json({
         success: false,
         message: `users not found`,
         })
      }
      res.status(200).json({
         success: true,
         message: `Successfully retrieved  all ${users.length} users`,
         data: users,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Internal error",
        data: error.message,
      });
   }
};


export const DeleteSingleUserById = async (req:Request<Params,{},IUser>, res:Response<ApiResponse<any>>) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({success:false, message: "User ID is required" });
      }
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
         return res.status(404).json({
            success: false,
            message: "User not found"
       });
      }
      res.status(200).json({
         success: true,
         message: "Users deleted successfully",
         data: deletedUser,
      });
   } catch (error:any) {
      res.status(500).json({
         success:false,
         message: "internal error" ,
         data:error.message
      });
   }
};