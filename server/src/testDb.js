import db from "./config/db.js";

const run = async () => {
  const users = await db.all("SELECT * FROM users");
  const habits = await db.all("SELECT * FROM habits");

  console.log("USERS:", users);
  console.log("HABITS:", habits);

  process.exit(0);
};

run();
