import db from "../../config/db.js";
import { getTodayDate } from "../../utils/date.js";

const XP_MAP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

/**
 * Create habit definition
 */
export async function createHabit(userId, data) {
  const { name, type, category, difficulty } = data;

  const result = await db.run(
    `
    INSERT INTO habits (user_id, name, type, category, difficulty)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, name, type, category, difficulty]
  );

  return {
    id: result.lastID,
    name,
    type,
    category,
    difficulty,
  };
}

/**
 * Log habit action (today)
 */
export async function logHabitAction(userId, data) {
  const { habit_id, status, type, difficulty } = data;
  const date = getTodayDate();

  // 1️⃣ Save habit log
  await db.run(
    `
    INSERT INTO habit_logs (user_id, habit_id, date, status)
    VALUES (?, ?, ?, ?)
    `,
    [userId, habit_id, date, status]
  );

  let xp = 0;

  // 2️⃣ XP RULES (FINAL)
  if (type === "good" && status === "done") {
    xp = XP_MAP[difficulty];
  }

  if (type === "bad" && status === "resisted") {
    xp = XP_MAP[difficulty];
  }

  if (type === "bad" && status === "did") {
    xp = -XP_MAP[difficulty]; // 🔥 NEGATIVE XP
  }

  // 3️⃣ Apply XP (positive OR negative)
  if (xp !== 0) {
    await db.run(
      `
      INSERT INTO xp_logs (user_id, source, amount)
      VALUES (?, 'habit', ?)
      `,
      [userId, xp]
    );

    await db.run(
      `
      UPDATE users
      SET total_xp = total_xp + ?
      WHERE id = ?
      `,
      [xp, userId]
    );
  }

  // 4️⃣ Fetch updated total XP
  const user = await db.get(
    `SELECT total_xp FROM users WHERE id = ?`,
    [userId]
  );

  return {
    habit_id,
    status,
    xp,
    total_xp: user.total_xp,
  };
}

/**
 * Get today's habits (only unlogged)
 */
export async function getTodayHabits(userId) {
  const date = getTodayDate();

  const rows = await db.all(
    `
    SELECT
      h.id,
      h.name,
      h.type,
      h.category,
      h.difficulty
    FROM habits h
    WHERE h.user_id = ?
      AND h.id NOT IN (
        SELECT habit_id
        FROM habit_logs
        WHERE user_id = ?
          AND date = ?
      )
    ORDER BY h.created_at ASC
    `,
    [userId, userId, date]
  );

  return rows;
}
