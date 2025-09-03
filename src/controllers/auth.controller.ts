import UserModel from "@model/user.model";
import { Request, Response } from "express";
import { ApiResponse, IUser, Params } from "../types/user";
import bcrypt from "bcrypt";
import { generateToken } from "@lib/generateToken";

export const RegisterUser = async (req: Request<{}, {}, IUser>, res: Response<ApiResponse<any>>) => {
   const { firstname, lastname, email, password,address,phone,role } = req.body;
   try {
      if (!firstname || !lastname || !password || !email) {
         return res.status(400).json({
            success: false,
            message: "All fields are required",
         });
      }
      //check for valid email
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
         return res.status(400).json({
            success: false,
            message: "Invalid email",
         });
      }
      // Check if user already exists
      const existingUser = await UserModel.find({ email });
      if (existingUser.length > 0) {
         return res.status(400).json({
            success: false,
            message: "User already exists",
         });
      }
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
         firstname,
         lastname,
         email,
         role,
         address,
         phone,
         password: hashedPassword,
      });

      const token = generateToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });
      await newUser.save();
      res.status(201).json({
         success: true,
         message: "User created successfully",
         data: {
            id: newUser.id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            address: newUser.address,
            phone: newUser.phone,
            role: newUser.role,
         },
         token,
      });
   } catch (error: any) {
      res.status(400).json({
          success: false, 
          data: error.message
          });
   }
};


export const loginUser =async (req: Request<{}, {}, IUser>, res: Response<ApiResponse<any>>) => {
   const { email, password } = req.body;
   try {
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required",
         });
      }
      //check for valid email
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
         return res.status(400).json({
            success: false,
            message: "Invalid email",
         });
      }
      //find user
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }
      //compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({
            success: false,
            message: "Invalid credentials",
         });
      }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });
      res.status(200).json({
         success: true,
         message: "Login successful",
         data: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
         },
         token,
      });
   } catch (error: any) {
      res.status(400).json({
          success: false, 
          data: error.message
          });
   }
};

export const UpdateUserId =  async (req:Request<Params,{},IUser>,res:Response<ApiResponse<any>>)=>{
   try {
      const {id} = req.params
      const { firstname, lastname, email, password,address,phone,role } = req.body;
      if (!id) {
         return res.status(400).json({ 
            success: false, 
            message: "User ID is required" });
      }
      const UpdatedUser = await UserModel.findByIdAndUpdate(id, { firstname, lastname, email, password,address,phone,role }, { new: true, runValidators: true });
      if (!UpdatedUser) {
         return res.status(404).json({ 
            success: false,
            message: "User not found" });
      }
      res.status(200).json({
         success: true,
         message: "Sucessfully updated Users",
      });
   } catch (error : any) {
      res.status(400).json({
          success: false, 
          data: error.message
          });
   }
}


export const getAllUsers = async (req:Request<{},{},IUser>, res:Response<ApiResponse<any>>) => {
   try {
      const users = await UserModel.find().populate('role');
      //check if it is admin
      // const isAdmin = req.user?.role === 'admin';  
      // if (!isAdmin) {
      //    return res.status(403).json({
      //       success: false,
      //       message: "Access denied. Admins only.",
      //    });
      // }
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

export const LogoutUser = async (req:Request,res:Response<ApiResponse<any>>)=>{
      try {
  
   } catch (error:any) {
      res.status(500).json({
         success:false,
         message: "internal error" ,
         data:error.message
      });
   }
}