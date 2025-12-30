import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

/* Required for ES Modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Open SQLite database */
const db = await open({
  filename: path.join(__dirname, "../life_rpg.db"),
  driver: sqlite3.Database,
});

/* ENABLE FOREIGN KEYS */
await db.exec("PRAGMA foreign_keys = ON;");

export default db;
