import { AddNewProduct, DeleteSingleBookById, getAllProducts, UpdateSIngleProductById,getSingleProductById } from "controllers/product.controller";
import { Router } from "express";
import { upload } from "../middleware/image.middleware";

const router:Router = Router();

router.post("/product/add",upload.single("image"), AddNewProduct);
router.get("/product/:id",getSingleProductById);
router.get("/products",getAllProducts );
router.put("/product/update/:id",upload.single("image"),UpdateSIngleProductById );
router.delete("/product/delete/:id", DeleteSingleBookById);

export default router;

