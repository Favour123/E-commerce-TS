// controllers/cart.controller.ts
import mongoose from "mongoose";
import Cart from "../model/cart.model";
import express, { Request, Response } from "express";
import { ApiResponse } from "../types/user";

//-- Payload Types
type AddItemBody = { userId: string; productId: string; quantity: number };
type RemoveItemBody = { userId: string; productId: string };
type UpdateQuantityBody = { userId: string; productId: string; quantity: number };

// Add Item
export const addItemToCart = async (req: Request<{}, {}, AddItemBody>, res: Response<ApiResponse<any>>) => {
   const { userId, productId, quantity } = req.body;
   if (!userId || !productId || quantity == null) {
      return res.status(400).json({
         success: false,
         message: "All fields are required",
      });
   }
   try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
         cart = new Cart({ userId, items: [] });
      }

      const idx = cart.items.findIndex((item) => item.productId.toString() === productId);

      if (idx > -1) {
         cart.items[idx].quantity += quantity;
      } else {
         cart.items.push({
            productId: new mongoose.Types.ObjectId(productId),
            quantity,
         });
      }

      await cart.save();
      return res.status(201).json({
         success: true,
         message: "Item added to cart successfully",
         data: cart,
      });
   } catch (err) {
      return res.status(500).json({
         success: false,
         message: "Internal error",
      });
   }
};

// Remove Item
export const removeItemFromCart = async (req: Request<{}, {}, RemoveItemBody>, res: Response<ApiResponse<any>>) => {
   const { userId, productId } = req.body;
   if (!userId || !productId) {
      return res.status(400).json({
         success: false,
         message: "All fields are required",
      });
   }
   try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found",
         });
      }

      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
      await cart.save();

      return res.status(200).json({
         success: true,
         message: "Item removed from cart successfully",
         data: cart,
      });
   } catch (err) {
      return res.status(500).json({
         success: false,
         message: "Internal error",
      });
   }
};

// Get Cart
export const getCartById = async (req: Request<{ userId: string }, {}, {}>, res: Response<ApiResponse<any>>) => {
   const { userId } = req.params;
   try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found",
         });
      }
      return res.status(200).json({
         success: true,
         message: "Cart retrieved successfully",
         data: cart,
      });
   } catch (err) {
      return res.status(500).json({
         success: false,
         message: "Internal error",
      });
   }
};

// Update Quantity
export const updateItemQuantity = async (req: Request<{}, {}, UpdateQuantityBody>, res: Response<ApiResponse<any>>) => {
   const { userId, productId, quantity } = req.body;
   if (!userId || !productId || quantity == null) {
      return res.status(400).json({
         success: false,
         message: "All fields are required",
      });
   }
   try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found",
         });
      }

      const idx = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (idx > -1) {
         cart.items[idx].quantity = quantity;
         await cart.save();
         return res.status(200).json({
            success: true,
            message: "Item quantity updated successfully",
            data: cart,
         });
      }

      return res.status(404).json({
         success: false,
         message: "Item not found in cart",
      });
   } catch (err) {
      return res.status(500).json({
         success: false,
         message: "Internal error",
      });
   }
};

// Clear All Carts (optional admin endpoint)
export const clearAllCarts = async (req: Request, res: Response<ApiResponse<any>>) => {
   try {
      await Cart.deleteMany({});
      return res.status(200).json({
         success: true,
         message: "All carts cleared",
      });
   } catch (err) {
      return res.status(500).json({
         success: false,
         message: "Internal error",
      });
   }
};
