import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import {
  getApplicationsCollection,
  getJobsCollection,
  type ApplicationStatus,
} from "@/lib/mongo"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to apply for jobs." },
      { status: 401 }
    )
  }

  // Role guard — only job seekers apply.
  const role = (session.user as { role?: string }).role ?? "job-seeker"
  if (role !== "job-seeker") {
    return NextResponse.json(
      { message: "Only job seeker accounts can apply for jobs." },
      { status: 403 }
    )
  }

  const payload = (await request.json().catch(() => null)) as
    | { ref?: unknown }
    | null
  const ref = typeof payload?.ref === "string" ? payload.ref.trim() : ""
  if (!ref) {
    return NextResponse.json(
      { message: "Job reference is required." },
      { status: 400 }
    )
  }

  const jobs = await getJobsCollection()
  const job = await jobs.findOne({ ref })
  if (!job) {
    return NextResponse.json(
      { message: "That job no longer exists." },
      { status: 404 }
    )
  }
  if (job.status !== "Active") {
    return NextResponse.json(
      { message: "This job is no longer accepting applications." },
      { status: 409 }
    )
  }

  const applications = await getApplicationsCollection()
  const already = await applications.findOne({
    jobRef: ref,
    seekerId: session.user.id,
  })
  if (already) {
    return NextResponse.json(
      { message: "You already applied to this job." },
      { status: 409 }
    )
  }

  const application = {
    jobRef: job.ref,
    jobTitle: job.title,
    company: job.company,
    status: "New" as ApplicationStatus,
    seekerId: session.user.id,
    seekerName: session.user.name,
    seekerEmail: session.user.email,
    recruiterId: job.postedById,
    appliedAt: new Date(),
  }

  await applications.insertOne(application)
  await jobs.updateOne({ _id: job._id }, { $inc: { applicantCount: 1 } })

  return NextResponse.json({ application }, { status: 201 })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to view applications." },
      { status: 401 }
    )
  }

  const applications = await getApplicationsCollection()
  const role = (session.user as { role?: string }).role ?? "job-seeker"

  const rows =
    role === "recruiter"
      ? await applications
          .find({ recruiterId: session.user.id })
          .sort({ appliedAt: -1 })
          .limit(100)
          .toArray()
      : await applications
          .find({ seekerId: session.user.id })
          .sort({ appliedAt: -1 })
          .limit(100)
          .toArray()

  return NextResponse.json({ applications: rows })
}
