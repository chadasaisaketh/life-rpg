import express from "express";
import auth from "../../middleware/authMiddleware.js";
import {
  createSkill,
  getActiveSkills,
  getCompletedSkills,
  completeComponent,
  getSkillComponents,
} from "./skills.controller.js";

const router = express.Router();

router.post("/", auth, createSkill);
router.get("/active", auth, getActiveSkills);
router.get("/completed", auth, getCompletedSkills);
router.post("/complete", auth, completeComponent);
router.get("/:skillId/components", auth, getSkillComponents);

export default router;
