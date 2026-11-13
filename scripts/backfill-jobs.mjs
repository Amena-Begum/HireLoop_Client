import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const url = env.match(/BETTER_AUTH_DB_URL=(\S+)/)[1];

const client = await new MongoClient(url).connect();
const db = client.db("hireloopdb");
const jobs = db.collection("jobs");

const docs = await jobs.find({}).toArray();
console.log("total jobs:", docs.length);

// Used refs so generated refs stay unique.
const usedRefs = new Set(
  (await jobs.find({}, { projection: { ref: 1 } }).toArray())
    .map((j) => j.ref)
    .filter(Boolean)
);

function nextRef() {
  for (;;) {
    const ref = `HL-${Math.floor(10000 + Math.random() * 90000)}`;
    if (!usedRefs.has(ref)) {
      usedRefs.add(ref);
      return ref;
    }
  }
}

let fixed = 0;
for (const doc of docs) {
  const update = {};

  if (!doc.ref) update.ref = nextRef();
  if (!doc.status) update.status = "Active";
  if (doc.views === undefined) update.views = 0;
  if (doc.applicantCount === undefined) update.applicantCount = 0;
  if (!doc.postedAt) {
    // Derive a sensible date from the import's ObjectId timestamp.
    update.postedAt = doc._id.getTimestamp();
  }
  if (!doc.postedByName) update.postedByName = "HireLoop Import";

  if (typeof doc.salaryMin === "string") {
    const n = Number(doc.salaryMin);
    update.salaryMin = Number.isFinite(n) ? n : null;
  }
  if (typeof doc.salaryMax === "string") {
    const n = Number(doc.salaryMax);
    update.salaryMax = Number.isFinite(n) ? n : null;
  }
  if (typeof doc.skills === "string") {
    update.skills = doc.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (Object.keys(update).length === 0) continue;

  await jobs.updateOne({ _id: doc._id }, { $set: update });
  fixed++;
}

console.log(`updated: ${fixed}`);
const sample = await jobs.findOne({});
console.log("sample now:", JSON.stringify(sample, null, 1));
await client.close();
