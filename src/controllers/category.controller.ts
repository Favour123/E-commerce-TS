import Category from "@model/category.model";
import express, { Express, Request, Response } from "express";
import { ApiResponse, Params, ProductCategory } from "../types/user";

export const getAllCategory = async (req: Request<{}, {}, ProductCategory>, res: Response<ApiResponse<any>>) => {
   try {
      const categories = await Category.find({});
      if (categories.length === 0) {
         return res.status(404).json({
            success: false,
            message: "No categories found",
         });
      }
      res.status(200).json({
         success: true,
         message: "categories fetch successfully",
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "internal error",
      });
   }
};
export const getSingleIdCategory = async (req: Request<{id:string}, {}, {}, ProductCategory>, res: Response<ApiResponse<any>>) => {
   try {
      const { id } = req.params;
      const categories = await Category.findById(id);

      if (!categories) {
         res.status(404).json({
            success: false,
            message: "category not found",
         });
      }
      res.status(200).json({
         success: true,
         message: "categories found sucessfully",
         data: categories,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "internal error",
      });
   }
};

export const createCategory = async (req: Request<{}, {}, ProductCategory>, res: Response<ApiResponse<any>>) => {
   try {
      const { name, description } = req.body;

      if (!name || !description) {
         res.status(400).json({
            success: false,
            message: "All fields are required",
         });
      }
      const newCategory = new Category({ name, description });
      await newCategory.save();
      res.status(201).json({
         success: true,
         message: "category created successfully",
         data: newCategory,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "internal error",
      });
   }
};

export const updateCategoryById = async (req: Request<Params, {}, ProductCategory>, res: Response<ApiResponse<any>>) => {
   try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name || !description) {
         res.status(400).json({
            success: false,
            message: "All fields are required",
         });
      }
      const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true, runValidators: true });
      if (!updatedCategory) {
         return res.status(404).json({
            success: false,
            message: "Category not found",
         });
      }
      res.status(200).json({
         success: true,
         message: "Category updated successfully",
         data: updatedCategory,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "internal error",
      });
   }
};
export const deleteCategoryById = async (req: Request<Params, {}, {}>, res: Response<ApiResponse<any>>) => {
   try {
      const { id } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
         return res.status(404).json({
            success: false,
            message: "Category not found",
         });
      }
      res.status(200).json({
         success: true,
         message: "Category deleted successfully",
         data: deletedCategory,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "internal error",
      });
   }
};
