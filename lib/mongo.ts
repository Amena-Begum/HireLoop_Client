// Exports: getDb, getJobsCollection, getApplicationsCollection,
// getProfilesCollection — plus re-exports of the shared domain types.
// Domain types live in lib/types.ts so they can be imported without the
// MongoDB connection.
import { MongoClient } from "mongodb"

import type {
  ApplicationDoc,
  JobDoc,
  ProfileDoc,
  SavedJobDoc,
} from "@/lib/types"

// Compatibility re-exports — existing `import { type JobDoc } from "@/lib/mongo"`
// code keeps working.
export type {
  ApplicationDoc,
  ApplicationStatus,
  JobDoc,
  ProfileDoc,
  UserRole,
  SavedJobDoc,
} from "@/lib/types"

const mongoUrl = process.env.BETTER_AUTH_DB_URL

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is missing.")
}

// Cache the connection on globalThis so dev-server HMR doesn't open a new
// pool on every reload. (Exports: getDb, getJobsCollection, getApplicationsCollection)
const globalCache = globalThis as unknown as {
  __hireloopMongo?: Promise<MongoClient>
}

const clientPromise: Promise<MongoClient> =
  globalCache.__hireloopMongo ?? new MongoClient(mongoUrl).connect()

globalCache.__hireloopMongo = clientPromise

export async function getDb() {
  const client = await clientPromise
  return client.db("hireloopdb")
}

export async function getJobsCollection() {
  const db = await getDb()
  return db.collection<JobDoc>("jobs")
}

export async function getApplicationsCollection() {
  const db = await getDb()
  return db.collection<ApplicationDoc>("applications")
}

export async function getProfilesCollection() {
  const db = await getDb()
  return db.collection<ProfileDoc>("profiles")
}

export async function getSavedJobsCollection() {
  const db = await getDb()
  return db.collection<SavedJobDoc>("savedJobs")
}
