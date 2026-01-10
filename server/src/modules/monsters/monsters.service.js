import db from "../../config/db.js";

/**
 * Return ALL monsters:
 * - Shadow monsters (not activated yet)
 * - Active monsters (hp > 0)
 * - Defeated monsters (hp = 0 but activated once)
 */
export async function getMonsters(userId) {
  const monsters = await db.all(
    `
    SELECT
      type,
      name,
      hp,
      is_active,
      is_defeated
    FROM monsters
    WHERE user_id = ?
    ORDER BY type
    `,
    [userId]
  );

  // Convert DB rows into frontend-friendly format
  return monsters.map((m) => ({
    type: m.type,
    name: m.name,
    hp: m.hp,
    state: m.is_active
      ? m.hp > 0
        ? "active"
        : "defeated"
      : "shadow",
  }));
}
