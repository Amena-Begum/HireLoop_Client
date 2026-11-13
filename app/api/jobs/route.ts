import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getJobsCollection } from "@/lib/mongo"
import {
  CURRENCIES,
  EMPLOYMENT_TYPES,
  WORK_MODES,
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

  const { searchParams } = new URL(request.url)
  // Default to the signed-in recruiter's own posts; ?all=1 lists everything.
  const mine = searchParams.get("all") !== "1"

  const jobs = await getJobsCollection()
  const rows = await jobs
    .find(mine ? { postedById: session.user.id } : {})
    .sort({ postedAt: -1 })
    .limit(50)
    .toArray()

  return NextResponse.json({ jobs: rows })
}
