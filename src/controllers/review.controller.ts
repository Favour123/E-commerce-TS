import { Request, Response } from "express";
import ProductModel from "@model/products.model";
import { ApiResponse, Params } from "../types/user";
import { Types } from "mongoose";

/**
 * ✅ Like a product
 */
export const likeProduct = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.likes = (product.likes || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product liked successfully",
      data: { likes: product.likes },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "internal error" });
  }
};

/**
 * ✅ Unlike a product
 */
export const unlikeProduct = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.likes = Math.max((product.likes || 0) - 1, 0);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product unliked successfully",
      data: { likes: product.likes },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "internal error" });
  }
};

export const addReviewToProduct = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user?._id; // from auth middleware

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Valid user ID required" });
    }

    if (!comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "Comment and rating are required",
      });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (rev: any) => rev.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    // push new review
    product.reviews.push({ user: userId, comment, rating });
    await product.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "internal error" });
  }
};

/**
 * ✅ Get all reviews of a product
 */
export const getProductReviews = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate("reviews.user", "username email");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product reviews fetched successfully",
      data: product.reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "internal error" });
  }
};
