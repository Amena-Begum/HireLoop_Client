/**
 * Promote a user to the admin role.
 *
 * Run:  node scripts/promote-admin.mjs user@example.com
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const url = env.match(/BETTER_AUTH_DB_URL=(\S+)/)[1];

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const client = await new MongoClient(url).connect();
const db = client.db("hireloopdb");

const r = await db
  .collection("user")
  .updateOne({ email: { $regex: `^${email}$`, $options: "i" } }, { $set: { role: "admin" } });

if (r.matchedCount === 0) {
  console.error(`No user found with email "${email}".`);
} else {
  console.log(`✔ ${email} is now an admin.`);
}

await client.close();
