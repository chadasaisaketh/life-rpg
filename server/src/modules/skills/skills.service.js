import db from "../../config/db.js";
import { getTodayDate } from "../../utils/date.js";

const COMPONENT_XP = 20;
const SKILL_BONUS_XP = 100;

/* CREATE SKILL */
export async function createSkill(userId, name, components) {
  const today = getTodayDate();

  const result = await db.run(
    `
    INSERT INTO skills (user_id, name, total_components, started_at)
    VALUES (?, ?, ?, ?)
    `,
    [userId, name, components.length, today]
  );

  const skillId = result.lastID;

  for (const c of components) {
    await db.run(
      `
      INSERT INTO skill_components (skill_id, name)
      VALUES (?, ?)
      `,
      [skillId, c]
    );
  }

  return { id: skillId, name };
}

/* GET ACTIVE SKILLS */
export async function getActiveSkills(userId) {
  return await db.all(
    `
    SELECT *
    FROM skills
    WHERE user_id = ? AND is_completed = 0
    `,
    [userId]
  );
}

/* GET COMPONENTS */


/* COMPLETE COMPONENT */
export async function completeComponent(userId, componentId, skillId) {
  const today = getTodayDate();

  // Mark component complete
  await db.run(
    `
    UPDATE skill_components
    SET is_completed = 1, completed_at = ?
    WHERE id = ?
    `,
    [today, componentId]
  );

  await db.run(
    `
    UPDATE skills
    SET completed_components = completed_components + 1
    WHERE id = ?
    `,
    [skillId]
  );

  const COMPONENT_XP = 20;
  let totalXpAdded = COMPONENT_XP;

  // Component XP
  await db.run(
    `
    INSERT INTO xp_logs (user_id, source, amount)
    VALUES (?, 'learning_component', ?)
    `,
    [userId, COMPONENT_XP]
  );

  await db.run(
    `
    UPDATE users
    SET total_xp = total_xp + ?
    WHERE id = ?
    `,
    [COMPONENT_XP, userId]
  );

  // Check skill completion
  const skill = await db.get(
    `SELECT * FROM skills WHERE id = ?`,
    [skillId]
  );

  if (skill.completed_components === skill.total_components) {
    const BONUS_XP = 100;
    totalXpAdded += BONUS_XP;

    await db.run(
      `
      UPDATE skills
      SET is_completed = 1, completed_at = ?
      WHERE id = ?
      `,
      [today, skillId]
    );

    await db.run(
      `
      INSERT INTO xp_logs (user_id, source, amount)
      VALUES (?, 'learning_complete', ?)
      `,
      [userId, BONUS_XP]
    );

    await db.run(
      `
      UPDATE users
      SET total_xp = total_xp + ?
      WHERE id = ?
      `,
      [BONUS_XP, userId]
    );
  }

  const user = await db.get(
    `SELECT total_xp FROM users WHERE id = ?`,
    [userId]
  );

  return {
    xp: totalXpAdded,
    total_xp: user.total_xp,
  };
}


/* COMPLETED SKILLS (KNOWLEDGE BASE) */
export async function getCompletedSkills(userId) {
  return await db.all(
    `
    SELECT
      name,
      started_at,
      completed_at,
      CAST(
        julianday(completed_at) - julianday(started_at)
        AS INTEGER
      ) AS duration_days
    FROM skills
    WHERE user_id = ? AND is_completed = 1
    `,
    [userId]
  );
}

export async function getSkillComponents(skillId) {
  return await db.all(
    `
    SELECT *
    FROM skill_components
    WHERE skill_id = ?
    `,
    [skillId]
  );
}
