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
