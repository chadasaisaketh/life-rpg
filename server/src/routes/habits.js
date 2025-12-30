import express from "express";
const router = express.Router();
import db from "../db.js";

/* TODAY HABITS */
router.get("/today", async (req, res) => {
  const userId = req.user.id;

  const habits = await db.all(
    `SELECT * FROM habits
     WHERE user_id = ? AND is_active = 1`,
    [userId]
  );

  res.json(habits);
});

/* LOG HABIT */
router.post("/log", async (req, res) => {
  const userId = req.user.id;
  const { habitId, completed } = req.body;

  await db.run(
    `INSERT INTO habit_logs (user_id, habit_id, completed, created_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [userId, habitId, completed ? 1 : 0]
  );

  res.json({ success: true });
});

/* WEEK STATS */
router.get("/week", async (req, res) => {
  const userId = req.user.id;

  const rows = await db.all(
    `
    SELECT
      strftime('%w', created_at) AS dayIndex,
      COUNT(*) AS completed
    FROM habit_logs
    WHERE user_id = ?
      AND completed = 1
      AND created_at >= DATE('now', '-6 days')
    GROUP BY dayIndex
    `,
    [userId]
  );

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const result = rows.map(r => ({
    day: days[r.dayIndex],
    completed: r.completed
  }));

  res.json(result);
});

export default router;
