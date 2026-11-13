import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import {
  getJobsCollection,
  getSavedJobsCollection,
} from "@/lib/mongo"

// Role guard — bookmarking is a job-seeker feature.
async function requireSeeker() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { error: NextResponse.json({ message: "Sign in to save jobs." }, { status: 401 }) }
  }
  const role = (session.user as { role?: string }).role ?? "job-seeker"
  if (role !== "job-seeker") {
    return {
      error: NextResponse.json(
        { message: "Only job seeker accounts can save jobs." },
        { status: 403 }
      ),
    }
  }
  return { session }
}

function readRef(payload: { ref?: unknown } | null) {
  return typeof payload?.ref === "string" ? payload.ref.trim() : ""
}

// POST { ref } — save (bookmark) a job for the signed-in seeker.
export async function POST(request: Request) {
  const guard = await requireSeeker()
  if (guard.error) return guard.error
  const session = guard.session!

  const payload = (await request.json().catch(() => null)) as
    | { ref?: unknown }
    | null
  const ref = readRef(payload)
  if (!ref) {
    return NextResponse.json(
      { message: "Job reference is required." },
      { status: 400 }
    )
  }

  const job = await (await getJobsCollection()).findOne({ ref })
  if (!job) {
    return NextResponse.json(
      { message: "That job no longer exists." },
      { status: 404 }
    )
  }

  const savedJobs = await getSavedJobsCollection()
  const already = await savedJobs.findOne({
    jobRef: ref,
    userId: session.user.id,
  })
  if (already) {
    return NextResponse.json(
      { message: "You already saved this job." },
      { status: 409 }
    )
  }

  await savedJobs.insertOne({
    userId: session.user.id,
    jobRef: job.ref,
    savedAt: new Date(),
  })

  return NextResponse.json({ saved: true }, { status: 201 })
}

// DELETE { ref } — remove a saved job (scoped to the signed-in seeker).
export async function DELETE(request: Request) {
  const guard = await requireSeeker()
  if (guard.error) return guard.error
  const session = guard.session!

  const payload = (await request.json().catch(() => null)) as
    | { ref?: unknown }
    | null
  const ref = readRef(payload)
  if (!ref) {
    return NextResponse.json(
      { message: "Job reference is required." },
      { status: 400 }
    )
  }

  const result = await (await getSavedJobsCollection()).deleteOne({
    jobRef: ref,
    userId: session.user.id,
  })

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { message: "That job is not in your saved list." },
      { status: 404 }
    )
  }

  return NextResponse.json({ removed: true })
}
