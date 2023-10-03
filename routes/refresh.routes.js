import { Router } from "express";
import { handleRefreshToken } from "../controllers/refreshToken.controller.js";

const router = Router();

router.get("/refresh", handleRefreshToken);

export default router;