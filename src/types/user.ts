import mongoose, { Types } from "mongoose";
export interface IUser {
   firstname: string;
   lastname: string;
   email: string;
   password: string;
   address?: string;
   phone?: string;
   role?: string; // Optional role field
   _id: mongoose.Types.ObjectId;
}

export interface JwtPayload {
   userId: string;
   role?: string;
}

export interface Params {
   id: string;
}

export interface Query {
   name?: string; // Optional query param
}

export interface ApiResponse<T> {
   success: boolean;
   data?: T;
   message?: string;
   token?: string;
}

export interface ProductType {
   name: string;
   description: string;
   category: Types.ObjectId;
   reviews: [
      {
         user: Types.ObjectId; // reference to User
         comment: string;
         rating: number; // 1–5
         createdAt?: Date;
      }
   ];
   likes: number;
   image: string;
   publicId: string;
   price: number;
   instock: boolean;
   createAt: Date;
   updatedAt: Date;
}

export interface ProductCategory {
   name: string; // e.g. "Brand", "Skincare", "Whatever"
   description: string;
}
export interface ICart {
   userId: Types.ObjectId;
   items: {
      productId: Types.ObjectId;
      quantity: number;
   }[];
}
export interface CardID {
   userId: Types.ObjectId;
   email: string;
   totalAmount: number;
   status: string;
   paymentMethod: string;
   shippingAddress: string;
}

export interface ProductImage {
   url: string;
   publicId: string;
}

export interface ICart {
   userId: Types.ObjectId;
   items: {
      productId: Types.ObjectId;
      quantity: number;
   }[];
}
