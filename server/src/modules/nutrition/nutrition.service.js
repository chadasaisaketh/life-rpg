import db from "../../config/db.js";
import { getTodayDate } from "../../utils/date.js";

/* ---------------- TARGETS ---------------- */

export async function getTargets(userId) {
  return await db.get(
    `SELECT * FROM nutrition_targets WHERE user_id = ?`,
    [userId]
  );
}

export async function saveTargets(userId, data) {
  const fields = [
    "calories", "protein", "carbs", "fats", "fiber",
    "sugar", "sodium", "potassium",
    "vitamin_a", "vitamin_b1", "vitamin_b2", "vitamin_b3",
    "vitamin_b6", "vitamin_b12", "vitamin_c",
    "vitamin_d", "vitamin_e", "vitamin_k", "folate",
    "calcium", "iron", "magnesium", "zinc",
    "phosphorus", "selenium"
  ];

  const values = fields.map(f => data[f] ?? null);

  await db.run(
    `
    INSERT INTO nutrition_targets (
      user_id, ${fields.join(",")}
    )
    VALUES (
      ?, ${fields.map(() => "?").join(",")}
    )
    ON CONFLICT(user_id) DO UPDATE SET
      ${fields.map(f => `${f}=excluded.${f}`).join(",")}
    `,
    [userId, ...values]
  );

  return getTargets(userId);
}

/* ---------------- ADD MEAL ---------------- */

export async function addMeal(userId, data) {
  const date = getTodayDate();

  const fields = [
    "meal", "calories", "protein", "carbs", "fats", "fiber",
    "sugar", "sodium", "potassium",
    "vitamin_a", "vitamin_b1", "vitamin_b2", "vitamin_b3",
    "vitamin_b6", "vitamin_b12", "vitamin_c",
    "vitamin_d", "vitamin_e", "vitamin_k", "folate",
    "calcium", "iron", "magnesium", "zinc",
    "phosphorus", "selenium"
  ];

  const values = fields.map(f => data[f] ?? null);

  await db.run(
    `
    INSERT INTO nutrition_logs (
      user_id, ${fields.join(",")}, date
    )
    VALUES (
      ?, ${fields.map(() => "?").join(",")}, ?
    )
    `,
    [userId, ...values, date]
  );
}

/* ---------------- TODAY SUMMARY ---------------- */

export async function getTodaySummary(userId) {
  const date = getTodayDate();

  return await db.get(
    `
    SELECT
      SUM(calories) calories,
      SUM(protein) protein,
      SUM(carbs) carbs,
      SUM(fats) fats,
      SUM(fiber) fiber,
      SUM(sugar) sugar,
      SUM(sodium) sodium,
      SUM(potassium) potassium,

      SUM(vitamin_a) vitamin_a,
      SUM(vitamin_b1) vitamin_b1,
      SUM(vitamin_b2) vitamin_b2,
      SUM(vitamin_b3) vitamin_b3,
      SUM(vitamin_b6) vitamin_b6,
      SUM(vitamin_b12) vitamin_b12,
      SUM(vitamin_c) vitamin_c,
      SUM(vitamin_d) vitamin_d,
      SUM(vitamin_e) vitamin_e,
      SUM(vitamin_k) vitamin_k,
      SUM(folate) folate,

      SUM(calcium) calcium,
      SUM(iron) iron,
      SUM(magnesium) magnesium,
      SUM(zinc) zinc,
      SUM(phosphorus) phosphorus,
      SUM(selenium) selenium
    FROM nutrition_logs
    WHERE user_id = ? AND date = ?
    `,
    [userId, date]
  );
}
export async function getWeekSummary(userId, startDate) {
  return await db.all(
    `
    SELECT
      date,
      SUM(calories) calories,
      SUM(protein) protein,
      SUM(carbs) carbs,
      SUM(fats) fats
    FROM nutrition_logs
    WHERE user_id = ?
      AND date >= ?
    GROUP BY date
    ORDER BY date
    `,
    [userId, startDate]
  );
}
export async function awardNutritionXP(userId) {
  const date = getTodayDate();

  // prevent double-award
  const already = await db.get(
    `
    SELECT 1 FROM xp_logs
    WHERE user_id = ?
      AND source = 'nutrition'
      AND DATE(created_at) = ?
    `,
    [userId, date]
  );

  if (already) return { xp: 0 };

  const targets = await getTargets(userId);
  const intake = await getTodaySummary(userId);

  if (!targets || !intake) return { xp: 0 };

  let xp = 0;

  /* ---------- MACROS ---------- */
  const macros = ["calories", "protein", "carbs", "fats"];
  const macrosHit = macros.every((k) =>
    targets[k] &&
    intake[k] &&
    intake[k] >= targets[k] * 0.9 &&
    intake[k] <= targets[k] * 1.1
  );

  if (macrosHit) xp += 25;

  /* ---------- VITAMINS ---------- */
  const vitamins = [
    "vitamin_a","vitamin_b1","vitamin_b2","vitamin_b3",
    "vitamin_b6","vitamin_b12","vitamin_c",
    "vitamin_d","vitamin_e","vitamin_k","folate",
  ];

  const vitaminsHit = vitamins.every((k) =>
    targets[k] && intake[k] && intake[k] >= targets[k] * 0.9
  );

  if (vitaminsHit) xp += 50;

  /* ---------- MINERALS ---------- */
  const minerals = [
    "calcium","iron","magnesium","zinc",
    "phosphorus","selenium","sodium","potassium",
  ];

  const mineralsHit = minerals.every((k) =>
    targets[k] && intake[k] && intake[k] >= targets[k] * 0.9
  );

  if (mineralsHit) xp += 25;

  /* ---------- PERFECT DAY ---------- */
  if (macrosHit && vitaminsHit && mineralsHit) {
    xp += 50;
  }

  if (xp > 0) {
    await db.run(
      `INSERT INTO xp_logs (user_id, source, amount)
       VALUES (?, 'nutrition', ?)`,
      [userId, xp]
    );

    await db.run(
      `UPDATE users SET total_xp = total_xp + ? WHERE id = ?`,
      [xp, userId]
    );
  }

  return { xp };
}
