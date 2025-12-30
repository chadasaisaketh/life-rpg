import express from "express";
const router = express.Router();
import db from "../../db.js";
import authMiddleware from "../../middleware/auth.Middleware.js";

/* Protect all habit routes */
router.use(authMiddleware);

/* TODAY HABITS */
router.get("/today", async (req, res) => {
  const userId = req.user.id;

  const habits = await db.all(
    `
    SELECT h.*, hl.completed
    FROM habits h
    LEFT JOIN habit_logs hl
      ON h.id = hl.habit_id
      AND DATE(hl.created_at) = DATE('now')
    WHERE h.user_id = ?
    `,
    [userId]
  );

  res.json(habits);
});

/* ADD HABIT */
router.post("/", async (req, res) => {
  const userId = req.user.id;
  const { name, type, difficulty } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Habit name required" });
  }

  const xp =
    difficulty === "hard" ? 30 :
    difficulty === "medium" ? 20 : 10;

  const result = await db.run(
    `
    INSERT INTO habits (user_id, name, type, xp, created_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [userId, name, type, xp]
  );

  res.json({
    id: result.lastID,
    name,
    type,
    xp,
  });
});


/* WEEK VIEW */
router.get("/week", async (req, res) => {
  const userId = req.user.id;

  const rows = await db.all(
    `
    SELECT DATE(created_at) as day, COUNT(*) as completed
    FROM habit_logs
    WHERE user_id = ?
      AND completed = 1
      AND created_at >= DATE('now', '-6 days')
    GROUP BY day
    `,
    [userId]
  );

  res.json(rows);
});

export default router;
