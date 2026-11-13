/** Shared domain types for HireLoop data (DB documents + session user). */

import type { ObjectId } from "mongodb"

import type { JobStatus } from "@/lib/constants"

/** better-auth role values stored on the user record. */
export type UserRole = "job-seeker" | "recruiter" | "admin"

export type JobDoc = {
  _id?: ObjectId
  /** Human-facing reference, e.g. "HL-90210" */
  ref: string
  title: string
  company: string
  description: string
  location: string
  workMode: string
  employmentType: string
  currency: string
  salaryMin: number | null
  salaryMax: number | null
  skills: string[]
  status: JobStatus
  views: number
  applicantCount: number
  /** better-auth user id of the recruiter who posted */
  postedById: string
  postedByName: string
  postedAt: Date
}

export type ApplicationStatus =
  | "New"
  | "Under Review"
  | "Shortlisted"
  | "Rejected"

export type ApplicationDoc = {
  _id?: ObjectId
  /** The job this application belongs to (job.ref) */
  jobRef: string
  jobTitle: string
  company: string
  status: ApplicationStatus
  /** better-auth user id of the seeker who applied */
  seekerId: string
  seekerName: string
  seekerEmail: string
  /** better-auth user id of the recruiter who posted the job */
  recruiterId: string
  appliedAt: Date
}

/** A job bookmarked by a seeker, per user id + job ref. */
export type SavedJobDoc = {
  _id?: ObjectId
  /** better-auth user id of the seeker */
  userId: string
  /** The saved job (job.ref) */
  jobRef: string
  savedAt: Date
}

/** Extra professional-profile fields, stored per user id. */
export type ProfileDoc = {
  _id?: ObjectId
  /** better-auth user id */
  userId: string
  headline: string
  bio: string
  skills: string[]
  /** Display name of the uploaded resume. */
  resumeName: string | null
  /** The resume file as a data URL (data:<type>;base64,...), capped at 4 MB. */
  resumeData: string | null
  /** MIME type of the stored resume, e.g. application/pdf */
  resumeType: string | null
  updatedAt: Date
}
