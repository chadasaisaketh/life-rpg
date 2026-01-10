import db from "./config/db.js";

await db.exec(`
  ALTER TABLE monsters ADD COLUMN is_active BOOLEAN DEFAULT 0;
  ALTER TABLE monsters ADD COLUMN is_defeated BOOLEAN DEFAULT 0;
`);

console.log("✅ Monsters table fixed");
process.exit(0);
