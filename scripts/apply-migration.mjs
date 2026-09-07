import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";

const envFile = readFileSync(new URL("../.env", import.meta.url), "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([A-Z_]+)\s*=\s*"?([^"\n\r]*)"?\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-migration.sql>");
  process.exit(1);
}

const sql = readFileSync(migrationPath, "utf-8");

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && s.replace(/--.*$/gm, "").trim().length > 0);

console.log(`Applying ${statements.length} statement(s) to Turso...`);

for (const statement of statements) {
  await client.execute(statement);
}

console.log("Done.");
client.close();
