import db from "./config/db.js";

async function init() {
  /* USERS */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      level INTEGER DEFAULT 1,
      total_xp INTEGER DEFAULT 0,

      age INTEGER,
      height_cm REAL,
      weight_kg REAL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  /* SAFE MIGRATIONS FOR EXISTING DBs */
  await addColumnIfNotExists("users", "age INTEGER");
  await addColumnIfNotExists("users", "height_cm REAL");
  await addColumnIfNotExists("users", "weight_kg REAL");

  /* HABITS */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      type TEXT CHECK(type IN ('good','bad')),
      category TEXT,
      difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  /* HABIT LOGS */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      habit_id INTEGER,
      date TEXT,
      status TEXT CHECK(status IN ('done','skipped','did','resisted')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(habit_id) REFERENCES habits(id)
    );
  `);

  /* XP LOGS */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS xp_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      source TEXT,
      amount INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  total_components INTEGER,
  completed_components INTEGER DEFAULT 0,
  started_at TEXT,
  completed_at TEXT,
  is_completed INTEGER DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS skill_components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_id INTEGER,
  name TEXT,
  is_completed INTEGER DEFAULT 0,
  completed_at TEXT,
  FOREIGN KEY(skill_id) REFERENCES skills(id)
);
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT, -- gym, run, walk, yoga
  duration_minutes INTEGER,
  distance_km REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS workout_muscles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER,
  muscle TEXT,
  FOREIGN KEY(workout_id) REFERENCES workouts(id)
);
CREATE TABLE IF NOT EXISTS nutrition_targets (
  user_id INTEGER PRIMARY KEY,

  /* MACROS */
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fats REAL,
  fiber REAL,

  /* SUGARS & SALTS */
  sugar REAL,
  sodium REAL,
  potassium REAL,

  /* VITAMINS */
  vitamin_a REAL,
  vitamin_b1 REAL,
  vitamin_b2 REAL,
  vitamin_b3 REAL,
  vitamin_b6 REAL,
  vitamin_b12 REAL,
  vitamin_c REAL,
  vitamin_d REAL,
  vitamin_e REAL,
  vitamin_k REAL,
  folate REAL,

  /* MINERALS */
  calcium REAL,
  iron REAL,
  magnesium REAL,
  zinc REAL,
  phosphorus REAL,
  selenium REAL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,

  meal TEXT, -- Breakfast, Lunch, Snack, Dinner, Custom

  /* MACROS */
  calories INTEGER,
  protein REAL,
  carbs REAL,
  fats REAL,
  fiber REAL,

  /* SUGARS & SALTS */
  sugar REAL,
  sodium REAL,
  potassium REAL,

  /* VITAMINS */
  vitamin_a REAL,
  vitamin_b1 REAL,
  vitamin_b2 REAL,
  vitamin_b3 REAL,
  vitamin_b6 REAL,
  vitamin_b12 REAL,
  vitamin_c REAL,
  vitamin_d REAL,
  vitamin_e REAL,
  vitamin_k REAL,
  folate REAL,

  /* MINERALS */
  calcium REAL,
  iron REAL,
  magnesium REAL,
  zinc REAL,
  phosphorus REAL,
  selenium REAL,

  date TEXT, -- YYYY-MM-DD
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
);



  `);

  console.log("✅ Database initialized / migrated");
}

/* 🔒 HELPER: ADD COLUMN ONLY IF MISSING */
async function addColumnIfNotExists(table, columnDef) {
  const [columnName] = columnDef.split(" ");

  const columns = await db.all(`PRAGMA table_info(${table})`);
  const exists = columns.some((c) => c.name === columnName);

  if (!exists) {
    await db.exec(
      `ALTER TABLE ${table} ADD COLUMN ${columnDef}`
    );
    console.log(`➕ Added column ${columnName} to ${table}`);
  }
}

init();
