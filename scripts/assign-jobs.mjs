import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const url = env.match(/BETTER_AUTH_DB_URL=(\S+)/)[1];

const EMAIL = "jobs@hireloop.test";
const NAME = "HireLoop Recruiter";

const client = await new MongoClient(url).connect();
const db = client.db("hireloopdb");

// Assign the imported jobs to this recruiter.
const result = await db.collection("jobs").updateMany(
  { postedByName: "HireLoop Import" },
  { $set: { postedByName: NAME } }
);
console.log(`jobs reassigned name: ${result.modifiedCount}`);

const user = await db.collection("user").findOne({ email: EMAIL });
if (!user) {
  console.log("USER NOT FOUND — create the account first (sign-up API), then re-run this.");
  await client.close();
  process.exit(1);
}
const uid = String(user.id ?? user._id);
console.log("user id:", uid, "role:", user.role);

const own = await db.collection("jobs").updateMany(
  { postedByName: NAME },
  { $set: { postedById: uid } }
);
console.log(`jobs assigned to ${EMAIL}: ${own.modifiedCount}`);

const count = await db.collection("jobs").countDocuments({ postedById: uid });
console.log("jobs owned now:", count);
await client.close();
