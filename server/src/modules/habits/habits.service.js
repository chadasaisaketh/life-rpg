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

  // Save habit log
  await db.run(
    `
    INSERT INTO habit_logs (user_id, habit_id, date, status)
    VALUES (?, ?, ?, ?)
    `,
    [userId, habit_id, date, status]
  );

  let xpGained = 0;

  // XP rules
  if (
    (type === "good" && status === "done") ||
    (type === "bad" && status === "resisted")
  ) {
    xpGained = XP_MAP[difficulty];

    await db.run(
      `
      INSERT INTO xp_logs (user_id, source, amount)
      VALUES (?, 'habit', ?)
      `,
      [userId, xpGained]
    );

    await db.run(
      `
      UPDATE users
      SET total_xp = total_xp + ?
      WHERE id = ?
      `,
      [xpGained, userId]
    );
  }

  return {
    habit_id,
    status,
    xp: xpGained,
  };
}

/**
 * Get today's habits with status
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
      h.difficulty,
      l.status
    FROM habits h
    LEFT JOIN habit_logs l
      ON h.id = l.habit_id AND l.date = ?
    WHERE h.user_id = ?
    ORDER BY h.created_at ASC
    `,
    [date, userId]
  );

  return rows;
}
