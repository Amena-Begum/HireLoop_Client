import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getProfilesCollection } from "@/lib/mongo"

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

/** Current session or null — profile endpoints work for any signed-in role. */
async function requireSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function GET() {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to view your profile." },
      { status: 401 }
    )
  }

  const profiles = await getProfilesCollection()
  const profile = await profiles.findOne(
    { userId: session.user.id },
    // The resume file itself is served by /api/profile/resume — keep the
    // potentially large data URL out of this payload.
    { projection: { resumeData: 0 } }
  )
  return NextResponse.json({ profile: profile ?? null })
}

/** Resume data URLs are stored inline — keep files under 4 MB. */
const MAX_RESUME_BYTES = 4 * 1024 * 1024

export async function PUT(request: Request) {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to update your profile." },
      { status: 401 }
    )
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        headline?: unknown
        bio?: unknown
        skills?: unknown
        resumeName?: unknown
        resumeChanged?: unknown
        resume?: { name?: unknown; data?: unknown; type?: unknown } | null
      }
    | null
  if (!payload) {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    )
  }

  const update: Record<string, unknown> = {
    userId: session.user.id,
    headline: asText(payload.headline),
    bio: asText(payload.bio),
    skills: asText(payload.skills)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    updatedAt: new Date(),
  }

  // Resume fields are only touched when the form says they changed, so an
  // untouched saved resume is never wiped by an unrelated profile edit.
  if (payload.resumeChanged === true) {
    const resume = payload.resume ?? null
    if (resume === null) {
      // Resume removed.
      update.resumeName = null
      update.resumeData = null
      update.resumeType = null
    } else {
      const name = asText(resume.name)
      const data = typeof resume.data === "string" ? resume.data : ""
      const type = asText(resume.type) || "application/octet-stream"
      if (name && data.startsWith("data:")) {
        const base64 = data.split(",")[1] ?? ""
        const bytes = Math.floor((base64.length * 3) / 4)
        if (bytes > MAX_RESUME_BYTES) {
          return NextResponse.json(
            { message: "Resume is too large — max 4 MB." },
            { status: 413 }
          )
        }
        update.resumeName = name
        update.resumeData = data
        update.resumeType = type
      } else {
        return NextResponse.json(
          { message: "Invalid resume file." },
          { status: 400 }
        )
      }
    }
  }

  const profiles = await getProfilesCollection()
  await profiles.updateOne(
    { userId: session.user.id },
    { $set: update },
    { upsert: true }
  )

  const profile = await profiles.findOne(
    { userId: session.user.id },
    { projection: { resumeData: 0 } }
  )
  return NextResponse.json({ profile })
}
