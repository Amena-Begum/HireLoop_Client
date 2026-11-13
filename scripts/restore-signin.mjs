/**
 * Restore password sign-in for an existing user.
 *
 * Run:  node scripts/restore-signin.mjs
 *
 * It prompts for an email and a NEW password, then re-creates the credential
 * (password) account record for that user. Passwords are hashed locally with
 * the same scrypt scheme better-auth uses — they are never sent anywhere.
 */
import readline from "node:readline/promises"
import { stdin, stdout } from "node:process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "url"

import { hashPassword } from "better-auth/crypto"
import { MongoClient } from "mongodb"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8")
const match = env.match(/BETTER_AUTH_DB_URL=(\S+)/)
if (!match) {
  console.error("BETTER_AUTH_DB_URL not found in .env")
  process.exit(1)
}
const client = new MongoClient(match[1])

const rl = readline.createInterface({ input: stdin, output: stdout })

async function restoreOne(db) {
  const email = (await rl.question("Email of the user to restore: ")).trim()
  const password = await rl.question("New password (min 8 chars): ")

  if (password.length < 8) {
    console.error("Password too short — skipping.")
    return
  }

  const user = await db.collection("user").findOne({
    email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  })
  if (!user) {
    console.error(`No user found with email "${email}".`)
    return
  }
  const userId = user.id ?? user._id.toString()

  await db.collection("account").deleteMany({ userId, providerId: "credential" })
  await db.collection("account").insertOne({
    accountId: userId,
    providerId: "credential",
    userId,
    password: await hashPassword(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  console.log(`✔ Sign-in restored for ${user.email} — use the new password.`)
}

try {
  await client.connect()
  const db = client.db("hireloopdb")
  await restoreOne(db)
  while ((await rl.question("Restore another account? (y/N): ")).trim().toLowerCase() === "y") {
    await restoreOne(db)
  }
} finally {
  rl.close()
  await client.close()
}
