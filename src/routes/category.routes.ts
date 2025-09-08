import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware";
import { createCategory, deleteCategoryById, getAllCategory, getSingleIdCategory, updateCategoryById } from "controllers/category.controller";
import { authenticate } from "@middleware/verfytoken";
const router:Router = Router();

router.post("/add", authenticate,isAdmin,createCategory);
router.get("/:id", getSingleIdCategory );
router.get("/category",getAllCategory);
router.put("/update/:id", authenticate,isAdmin,updateCategoryById );
router.delete("/delete/:id", authenticate,isAdmin,deleteCategoryById);

export default router;


