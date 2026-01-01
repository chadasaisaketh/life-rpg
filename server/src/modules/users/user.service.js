import db from "../../config/db.js";

export async function getProfile(userId) {
  return await db.get(
    `
    SELECT
      id,
      name,
      email,
      age,
      height_cm,
      weight_kg
    FROM users
    WHERE id = ?
    `,
    [userId]
  );
}

export async function updateProfile(userId, data) {
  const { name, age, height_cm, weight_kg } = data;

  await db.run(
    `
    UPDATE users
    SET
      name = COALESCE(?, name),
      age = ?,
      height_cm = ?,
      weight_kg = ?
    WHERE id = ?
    `,
    [name, age, height_cm, weight_kg, userId]
  );

  return getProfile(userId);
}
