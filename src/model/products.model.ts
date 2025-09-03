import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ProductType } from "../types/user";

// Extend ProductType with mongoose's Document
export interface ProductDocument extends ProductType, Document<Types.ObjectId> {}

const ProductSchema = new Schema<ProductDocument>({
   name: {
      type: String,
      required: true,
   },
   category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
   },
   price: {
      type: Number,
      required: true,
   },
   likes:{
      type:Number
   },
   reviews: [
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
  },
],
   image: { type: String },
   publicId : { // this is used to check for the image id on cloudinary
         type: String,
           },
   instock: { type: Boolean },
   createAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});

const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>("Product", ProductSchema);

export default ProductModel;
