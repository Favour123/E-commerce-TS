import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "../types/user";

// Extend IUser with mongoose's Document
export interface IUserDocument extends IUser, Document<Types.ObjectId> {}

const UserSchema = new Schema<IUserDocument>(
   {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      address:{type:String } ,
      phone:{type: String},
      role: { type: String, enum: ["user", "admin"], default: "user" }, // Optional role field
   },
   { timestamps: true }
);

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
