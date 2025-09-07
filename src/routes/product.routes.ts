import { AddNewProduct, DeleteSingleProductById, getAllProducts, UpdateSIngleProductById,getSingleProductById, searchProducts } from "controllers/product.controller";
import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware";
import uploader from "../middleware/image.middleware";

const router:Router = Router();

router.post("/add",isAdmin,uploader.single("image"), AddNewProduct);
router.get("/:id",isAdmin,uploader.single("image"),getSingleProductById);
router.get ("/search/",isAdmin,uploader.single("image"),searchProducts)
router.get("/products",isAdmin,uploader.single("image"),getAllProducts );
router.put("/update/:id",isAdmin,uploader.single("image"), UpdateSIngleProductById );
router.delete("/delete/:id",isAdmin,DeleteSingleProductById);

export default router;


