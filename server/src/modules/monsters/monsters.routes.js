import express from "express";
import auth from "../../middleware/authMiddleware.js";
import { getMonsters } from "./monsters.controller.js";

const router = express.Router();

/**
 * GET /api/monsters
 * Returns dynamically computed monsters
 */
router.get("/", auth, getMonsters);

export default router;
