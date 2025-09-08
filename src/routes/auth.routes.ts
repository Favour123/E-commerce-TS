import { Router } from "express";
import { RegisterUser,loginUser } from "../controllers/auth.controller";

const router:Router = Router();

router.post("/auth/register", RegisterUser);
router.post("/auth/login", loginUser);
// router.get("/", findUsersByQuery);

export default router;
