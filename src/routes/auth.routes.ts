import { Router } from "express";
import { RegisterUser,loginUser,UpdateUserId,getAllUsers,DeleteSingleUserById } from "../controllers/auth.controller";

const router:Router = Router();

router.post("/auth/register", RegisterUser);
router.post("/auth/login", loginUser);
router.get("/auth/:id", UpdateUserId);
router.get("/", getAllUsers);
router.delete("/:id", DeleteSingleUserById);
router.put("/update/:id",UpdateUserId )
// router.get("/", findUsersByQuery);

export default router;
