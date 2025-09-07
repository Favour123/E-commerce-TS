import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware";
import { createCategory, deleteCategoryById, getAllCategory, getSingleIdCategory, updateCategoryById } from "controllers/category.controller";

const router:Router = Router();

router.post("/add",isAdmin,createCategory);
router.get("/:id",isAdmin, getSingleIdCategory );
router.get("/category",isAdmin,getAllCategory);
router.put("/update/:id",isAdmin,updateCategoryById );
router.delete("/delete/:id",isAdmin,deleteCategoryById);

export default router;


