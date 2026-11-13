/** Shared option lists + union types used across job forms and APIs. */

export const WORK_MODES = ["On-site", "Hybrid", "Remote"] as const
export type WorkMode = (typeof WORK_MODES)[number]

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export const CURRENCIES = ["$", "€", "£"] as const
export type Currency = (typeof CURRENCIES)[number]

export const JOB_STATUSES = ["Active", "Paused", "Closed"] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const APPLICATION_STATUSES = [
  "New",
  "Under Review",
  "Shortlisted",
  "Rejected",
] as const
