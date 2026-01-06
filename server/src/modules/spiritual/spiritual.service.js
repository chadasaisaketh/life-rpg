import db from "../../config/db.js";
import { getTodayDate } from "../../utils/date.js";

const XP_RULES = {
  meditation: 2, // per minute
  yoga: 1,
  silence: 1,
  chanting: 1, // per 10 chants
};

export async function addPractice(userId, data) {
  const date = getTodayDate();
  const { type, duration_minutes, count } = data;

  await db.run(
    `
    INSERT INTO spiritual_logs (user_id, type, duration_minutes, count, date)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, type, duration_minutes ?? null, count ?? null, date]
  );

  let xp = 0;

  if (type === "chanting") {
    xp = Math.floor((count || 0) / 10) * XP_RULES[type];
  } else {
    xp = (duration_minutes || 0) * XP_RULES[type];
  }

  if (xp > 0) {
    await db.run(
      `INSERT INTO xp_logs (user_id, source, amount)
       VALUES (?, 'spiritual', ?)`,
      [userId, xp]
    );

    await db.run(
      `UPDATE users SET total_xp = total_xp + ? WHERE id = ?`,
      [xp, userId]
    );
  }

  return { xp };
}

export async function getTodaySummary(userId) {
  const date = getTodayDate();

  return await db.all(
    `
    SELECT type,
           SUM(duration_minutes) as minutes,
           SUM(count) as count
    FROM spiritual_logs
    WHERE user_id = ? AND date = ?
    GROUP BY type
    `,
    [userId, date]
  );
}

export async function getStreak(userId) {
  const rows = await db.all(
    `
    SELECT DISTINCT date
    FROM spiritual_logs
    WHERE user_id = ?
    ORDER BY date DESC
    `,
    [userId]
  );

  let streak = 0;
  let current = new Date();

  for (const r of rows) {
    const d = new Date(r.date);
    if (
      d.toDateString() === current.toDateString()
    ) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else break;
  }

  return streak;
}
