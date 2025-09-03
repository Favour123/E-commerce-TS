import { addItemToCart, getCartById, removeItemFromCart, updateItemQuantity } from "controllers/cart.controller";
import { Router } from "express";

const router:Router = Router();

router.post("/cart/add", addItemToCart);
router.post("/cart/remove",removeItemFromCart );
router.put("/cart/update",updateItemQuantity );
router.get("/cart/:userId", getCartById);

export default router;
