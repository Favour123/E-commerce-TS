import UserModel from "@model/user.model";
import { Request, Response } from "express";
import { ApiResponse, IUser, Params } from "../types/user";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "@lib/generateToken";

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

      const token = generateTokenAndSetCookie({
      userId: newUser._id.toString(),
      role: newUser.role,
    },
   res
);
      await newUser.save();
      res.status(201).json({
         success: true,
         message: "User created successfully",
      //   only when wh
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

    const token = generateTokenAndSetCookie({
      userId: user._id.toString(),
      role: user.role,
    },res
   );
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


export const LogoutUser = async (req:Request,res:Response<ApiResponse<any>>) => {
   try {
      res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
   } catch (error:any) {
      res.status(500).json({
         success:false,
         message: "internal error" ,
         data:error.message });
   }
};