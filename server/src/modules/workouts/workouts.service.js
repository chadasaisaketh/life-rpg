import db from "../../config/db.js";

const XP_MAP = {
  gym: 30,
  run: 40,
  walk: 15,
  yoga: 20,
};

export async function addWorkout(userId, data) {
  const { type, duration_minutes, distance_km, muscles = [] } = data;

  const result = await db.run(
    `
    INSERT INTO workouts (user_id, type, duration_minutes, distance_km)
    VALUES (?, ?, ?, ?)
    `,
    [userId, type, duration_minutes, distance_km ?? null]
  );

  const workoutId = result.lastID;

  for (const muscle of muscles) {
    await db.run(
      `INSERT INTO workout_muscles (workout_id, muscle) VALUES (?, ?)`,
      [workoutId, muscle]
    );
  }

  const XP_MAP = { gym: 30, run: 40, walk: 15, yoga: 20 };
  const xp = XP_MAP[type] || 10;

  await db.run(
    `INSERT INTO xp_logs (user_id, source, amount) VALUES (?, 'workout', ?)`,
    [userId, xp]
  );

  await db.run(
    `UPDATE users SET total_xp = total_xp + ? WHERE id = ?`,
    [xp, userId]
  );

  return { xp };
}


export async function getWeeklyWorkouts(userId) {
  return await db.all(
    `
    SELECT type,
           COUNT(*) as sessions,
           SUM(duration_minutes) as total_minutes,
           SUM(distance_km) as total_km
    FROM workouts
    WHERE user_id = ?
      AND created_at >= date('now','-6 days')
    GROUP BY type
    `,
    [userId]
  );
}
export async function getWeeklyMuscleHeatmap(userId) {
  return await db.all(
    `
    SELECT wm.muscle, COUNT(*) as intensity
    FROM workout_muscles wm
    JOIN workouts w ON w.id = wm.workout_id
    WHERE w.user_id = ?
      AND w.created_at >= date('now','-6 days')
    GROUP BY wm.muscle
    `,
    [userId]
  );
}
