import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getJobsCollection } from "@/lib/mongo"
import {
  CURRENCIES,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  WORK_MODES,
} from "@/lib/constants"

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function asSalary(value: unknown): number | null | undefined {
  if (value === null || value === undefined) return null
  if (value === "") return undefined // field not provided — keep existing
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/** Authenticated recruiter guard; returns the session or a 401/403 response. */
async function requireRecruiter() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { message: "Sign in to manage jobs." },
        { status: 401 }
      ),
    }
  }
  const role = (session.user as { role?: string }).role ?? "job-seeker"
  if (role !== "recruiter") {
    return {
      session: null,
      error: NextResponse.json(
        { message: "Only recruiter accounts can manage jobs." },
        { status: 403 }
      ),
    }
  }
  return { session, error: null }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { session, error } = await requireRecruiter()
  if (error || !session) return error

  const { ref } = await params
  const payload = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null
  if (!payload) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    )
  }

  // Collect the editable fields present in the payload.
  const update: Record<string, unknown> = {}

  const title = asString(payload.title)
  if (title) update.title = title

  if (payload.company !== undefined) update.company = asString(payload.company)
  if (payload.description !== undefined) {
    const description = asString(payload.description)
    if (!description) {
      return NextResponse.json(
        { message: "Description can't be empty." },
        { status: 400 }
      )
    }
    update.description = description
  }
  if (payload.location !== undefined) {
    const location = asString(payload.location)
    if (!location) {
      return NextResponse.json(
        { message: "Location can't be empty." },
        { status: 400 }
      )
    }
    update.location = location
  }

  const workMode = asString(payload.workMode)
  if (workMode) {
    if (!(WORK_MODES as readonly string[]).includes(workMode)) {
      return NextResponse.json(
        { message: "Invalid work mode." },
        { status: 400 }
      )
    }
    update.workMode = workMode
  }

  const employmentType = asString(payload.employmentType)
  if (employmentType) {
    if (!(EMPLOYMENT_TYPES as readonly string[]).includes(employmentType)) {
      return NextResponse.json(
        { message: "Invalid employment type." },
        { status: 400 }
      )
    }
    update.employmentType = employmentType
  }

  const currency = asString(payload.currency)
  if (currency) {
    if (!(CURRENCIES as readonly string[]).includes(currency)) {
      return NextResponse.json(
        { message: "Invalid currency." },
        { status: 400 }
      )
    }
    update.currency = currency
  }

  const salaryMin = asSalary(payload.salaryMin)
  if (salaryMin !== undefined) update.salaryMin = salaryMin

  const salaryMax = asSalary(payload.salaryMax)
  if (salaryMax !== undefined) update.salaryMax = salaryMax

  if (payload.skills !== undefined) {
    update.skills = asString(payload.skills)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
  }

  const status = asString(payload.status)
  if (status) {
    if (!(JOB_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 })
    }
    update.status = status
  }

  // Cross-field salary check against the merged values.
  const jobs = await getJobsCollection()
  const current = await jobs.findOne({ ref, postedById: session.user.id })
  if (!current) {
    return NextResponse.json(
      { message: "Job not found among your posts." },
      { status: 404 }
    )
  }

  const mergedMin =
    update.salaryMin !== undefined ? update.salaryMin : current.salaryMin
  const mergedMax =
    update.salaryMax !== undefined ? update.salaryMax : current.salaryMax
  if (
    mergedMin !== null &&
    mergedMax !== null &&
    (mergedMax as number) < (mergedMin as number)
  ) {
    return NextResponse.json(
      { message: "Maximum salary can't be lower than the minimum." },
      { status: 400 }
    )
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { message: "Nothing to update." },
      { status: 400 }
    )
  }

  const result = await jobs.updateOne(
    // Ownership scoped — a recruiter can only ever touch their own posts.
    { ref, postedById: session.user.id },
    { $set: update }
  )
  if (result.matchedCount === 0) {
    return NextResponse.json(
      { message: "Job not found among your posts." },
      { status: 404 }
    )
  }

  const job = await jobs.findOne({ ref, postedById: session.user.id })
  return NextResponse.json({ job })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { session, error } = await requireRecruiter()
  if (error || !session) return error

  const { ref } = await params
  const jobs = await getJobsCollection()
  const result = await jobs.deleteOne({
    ref,
    // Ownership scoped — recruiters can only delete their own posts.
    postedById: session.user.id,
  })

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { message: "Job not found among your posts." },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true })
}
