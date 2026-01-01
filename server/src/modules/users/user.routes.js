import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "./user.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);

export default router;
