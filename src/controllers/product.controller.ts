import { Request, Response } from "express";
import ProductModel from "@model/products.model";
import cloudinary from "@config/cloudinary.config";
import {uploadFiletoCloudinary} from "../helper/cloudinaryHelper";
import { ApiResponse, Params, ProductType, Query } from "../types/user";
import fs from "fs";

export const getAllProducts = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const allProducts = await ProductModel.find({});
    if (allProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Products found",
      });
    }
    res.status(200).json({
      success: true,
      message: "This is all books available in the collection",
      data: allProducts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};


export const getSingleProductById = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const ProductId = await ProductModel.findById(id);
    if (!ProductId) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist",
      });
    }
    res.status(200).json({
      success: true,
      message: "This is the book you are looking for",
      data: ProductId,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};


export const AddNewProduct = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { name, description, price, instock, category } = req.body;

    if (!name || !price || !instock) {
      return res.status(400).json({
        success: false,
        message: "All required fields (name, price, instock) must be provided",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    // Upload to cloudinary directly
    const { image,publicId} = await uploadFiletoCloudinary(req.file.path);

    const newProduct = new ProductModel({
      name,
      description,
      price,
      instock,
      category,
      image, // store cloudinary image URL
      publicId // optional: keep track for deletions
    });

    await newProduct.save();
    // Remove the file from local uploads folder after upload
      fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};


export const UpdateSIngleProductById = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const { name, description, price, instock, category } = req.body;

    const updateData: Partial<ProductType> = { name, description, price, instock, category };

    // If a new image is uploaded, replace old one in cloudinary
    if (req.file) {
      const product = await ProductModel.findById(id);
      if (product?.publicId) {
        await cloudinary.uploader.destroy(product.publicId);
      }

      const { image,publicId}= await uploadFiletoCloudinary(req.file.path);
      updateData.image = image;
      updateData.publicId =publicId;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};

export const DeleteSingleProductById = async (req: Request<Params>, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete from Cloudinary if exists
    if (product.publicId) {
      await cloudinary.uploader.destroy(product.publicId);
    }

    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};


export const searchProducts = async (req: Request<{}, {}, {}, Query>, res: Response<ApiResponse<ProductType[]>>) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Search term (name) is required",
      });
    }

    const products = await ProductModel.find({
      name: { $regex: name, $options: "i" },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found matching '${name}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Products matching '${name}' fetched successfully!`,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
