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
    SELECT
      wm.muscle,
      COUNT(*) AS intensity,
      CASE
        WHEN COUNT(*) >= 4 THEN 1
        ELSE 0
      END AS overtrained
    FROM workout_muscles wm
    JOIN workouts w ON w.id = wm.workout_id
    WHERE w.user_id = ?
      AND w.created_at >= date('now','-6 days')
    GROUP BY wm.muscle
    `,
    [userId]
  );
}

export async function getAvatarStats(userId) {
  const stats = await db.get(
    `
    SELECT
      SUM(CASE WHEN type = 'gym' THEN 1 ELSE 0 END) AS gym_sessions,
      SUM(CASE WHEN type = 'yoga' THEN 1 ELSE 0 END) AS yoga_sessions,
      SUM(CASE WHEN type IN ('run','walk') THEN distance_km ELSE 0 END) AS cardio_km,
      COUNT(DISTINCT date(created_at)) AS active_days
    FROM workouts
    WHERE user_id = ?
      AND created_at >= date('now','-30 days')
    `,
    [userId]
  );

  const muscles = await db.get(
    `
    SELECT COUNT(*) AS muscle_hits
    FROM workout_muscles wm
    JOIN workouts w ON w.id = wm.workout_id
    WHERE w.user_id = ?
      AND w.created_at >= date('now','-30 days')
    `,
    [userId]
  );

  const strength =
    (stats.gym_sessions || 0) * 10 +
    (muscles.muscle_hits || 0) * 2;

  const endurance =
    (stats.cardio_km || 0) * 5;

  const recovery =
    (stats.yoga_sessions || 0) * 10;

  const discipline =
    (stats.active_days || 0) * 3;

  return {
    strength,
    endurance,
    recovery,
    discipline,
  };
}
export async function getMuscleBalance(userId) {
  const rows = await db.all(
    `
    SELECT wm.muscle, COUNT(*) AS count
    FROM workout_muscles wm
    JOIN workouts w ON w.id = wm.workout_id
    WHERE w.user_id = ?
      AND w.created_at >= date('now','-30 days')
    GROUP BY wm.muscle
    `,
    [userId]
  );

  const upperMuscles = ["chest", "back", "shoulders", "biceps", "triceps"];
  const lowerMuscles = ["legs", "calves"];

  let upper = 0;
  let lower = 0;

  rows.forEach((r) => {
    if (upperMuscles.includes(r.muscle)) upper += r.count;
    if (lowerMuscles.includes(r.muscle)) lower += r.count;
  });

  const balance =
    upper && lower
      ? Math.round((Math.min(upper, lower) / Math.max(upper, lower)) * 100)
      : 0;

  return {
    upper,
    lower,
    balance,
  };
}
