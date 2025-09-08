import { AddNewProduct, DeleteSingleProductById, getAllProducts, UpdateSIngleProductById,getSingleProductById, searchProducts } from "controllers/product.controller";
import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware";
import uploader from "../middleware/image.middleware";
import { authenticate } from "@middleware/verfytoken";

const router:Router = Router();
router.get ("/search/",searchProducts)
router.get("/products",getAllProducts );
router.get("/:id",getSingleProductById);
router.post("/add",authenticate,isAdmin,uploader.single("image"), AddNewProduct);
router.put("/update/:id",isAdmin,uploader.single("image"), UpdateSIngleProductById );
router.delete("/delete/:id",isAdmin,DeleteSingleProductById);

export default router;


