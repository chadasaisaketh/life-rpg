import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve(process.cwd(), "life.db");

console.log("🟢 SQLite DB path:", dbPath);

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database,
});

await db.exec("PRAGMA foreign_keys = ON;");

export default db;
