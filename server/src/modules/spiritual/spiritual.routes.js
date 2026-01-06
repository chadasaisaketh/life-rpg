import express from "express";
import auth from "../../middleware/authMiddleware.js";
import {
  addPractice,
  getToday,
  getStreak,
 
} from "./spiritual.controller.js";

const router = express.Router();

router.post("/", auth, addPractice);
router.get("/today", auth, getToday);
router.get("/streak", auth, getStreak);

export default router;
