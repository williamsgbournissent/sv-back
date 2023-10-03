import { Router } from "express";
import { handleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth", handleLogin);

export default router;
