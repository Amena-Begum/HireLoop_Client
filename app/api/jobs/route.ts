import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getJobsCollection } from "@/lib/mongo"
import { escapeRegex } from "@/lib/search"
import {
  CURRENCIES,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  WORK_MODES,
  type JobStatus,
} from "@/lib/constants"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "HTTP://localhost:5000"

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function asSalary(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export const getJobById = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`)
  return res.json();
}

function isValidPayload(payload: Record<string, unknown>) {
  const errors: string[] = []
  const workMode = asString(payload.workMode)
  const employmentType = asString(payload.employmentType)
  const currency = asString(payload.currency)
  const salaryMin = asSalary(payload.salaryMin)
  const salaryMax = asSalary(payload.salaryMax)

  if (!asString(payload.title)) errors.push("Job title is required.")
  if (!asString(payload.description)) errors.push("Description is required.")
  if (!asString(payload.location)) errors.push("Location is required.")
  if (workMode && !(WORK_MODES as readonly string[]).includes(workMode)) {
    errors.push("Invalid work mode.")
  }
  if (
    employmentType &&
    !(EMPLOYMENT_TYPES as readonly string[]).includes(employmentType)
  ) {
    errors.push("Invalid employment type.")
  }
  if (currency && !(CURRENCIES as readonly string[]).includes(currency)) {
    errors.push("Invalid currency.")
  }
  if (salaryMin !== null && salaryMax !== null && salaryMax < salaryMin) {
    errors.push("Maximum salary can't be lower than the minimum.")
  }

  return { errors, workMode, employmentType, currency, salaryMin, salaryMax }
}

async function generateRef() {
  const jobs = await getJobsCollection()
  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = `HL-${Math.floor(10000 + Math.random() * 90000)}`
    if (!(await jobs.findOne({ ref }))) return ref
  }
  // Practically unreachable — fall back to a timestamp-based suffix.
  return `HL-${Date.now() % 100000}`
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to post a job." },
      { status: 401 }
    )
  }

  // Role guard — only recruiter accounts may post jobs.
  const role = (session.user as { role?: string }).role ?? "job-seeker"
  if (role !== "recruiter") {
    return NextResponse.json(
      { message: "Only recruiter accounts can post jobs." },
      { status: 403 }
    )
  }

  const payload = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null
  if (!payload) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    )
  }

  const { errors, workMode, employmentType, currency, salaryMin, salaryMax } =
    isValidPayload(payload)
  if (errors.length > 0) {
    return NextResponse.json({ message: errors.join(" ") }, { status: 400 })
  }

  const jobs = await getJobsCollection()
  const ref = await generateRef()

  const job = {
    ref,
    title: asString(payload.title),
    company: asString(payload.company),
    description: asString(payload.description),
    location: asString(payload.location),
    workMode: workMode || "Hybrid",
    employmentType: employmentType || "Full-time",
    currency: currency || "$",
    salaryMin,
    salaryMax,
    skills: asString(payload.skills)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    status: "Active" as const,
    views: 0,
    applicantCount: 0,
    postedById: session.user.id,
    postedByName: session.user.name,
    postedAt: new Date(),
  }

  await jobs.insertOne(job)
  return NextResponse.json({ job }, { status: 201 })
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to view jobs." },
      { status: 401 }
    )
  }

  const role = (session.user as { role?: string }).role ?? "job-seeker"
  const { searchParams } = new URL(request.url)

  // Default: the signed-in user's own posts (recruiters post; other roles
  // simply get an empty list). ?all=1 lists every job — admins only.
  const all = searchParams.get("all") === "1" && role === "admin"

  // Optional filters — all validated so params can't probe the collection.
  const statusParam = asString(searchParams.get("status"))
  const status =
    statusParam && (JOB_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as JobStatus)
      : null

  const q = asString(searchParams.get("q"))

  const limitParam = Number(searchParams.get("limit"))
  const limit =
    Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 100
      ? limitParam
      : 50
  const pageParam = Number(searchParams.get("page"))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  const filter: Record<string, unknown> = {}
  if (!all) {
    filter.postedById = session.user.id
  }
  if (status) {
    filter.status = status
  }
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" }
    filter.$or = [{ title: rx }, { company: rx }, { location: rx }]
  }

  const jobs = await getJobsCollection()
  const [rows, total] = await Promise.all([
    jobs
      .find(filter)
      .sort({ postedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    jobs.countDocuments(filter),
  ])

  return NextResponse.json({ jobs: rows, total, page, limit })
}
