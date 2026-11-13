import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getProfilesCollection } from "@/lib/mongo"

/**
 * Serves the signed-in user's stored resume file.
 * Opens inline in a new tab (PDF preview); add ?download=1 to force a
 * download instead.
 */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json(
      { message: "Sign in to view your resume." },
      { status: 401 }
    )
  }

  const profiles = await getProfilesCollection()
  const profile = await profiles.findOne(
    { userId: session.user.id },
    { projection: { resumeData: 1, resumeName: 1, resumeType: 1 } }
  )

  if (!profile?.resumeData) {
    return NextResponse.json(
      { message: "No resume uploaded yet." },
      { status: 404 }
    )
  }

  const [meta, base64] = profile.resumeData.split(",")
  const mime = profile.resumeType || meta?.match(/data:([^;]+)/)?.[1] || "application/octet-stream"
  const buffer = Buffer.from(base64, "base64")

  const download = new URL(request.url).searchParams.get("download") === "1"
  const disposition = download ? "attachment" : "inline"

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(buffer.length),
      "Content-Disposition": `${disposition}; filename="${profile.resumeName ?? "resume"}"`,
      "Cache-Control": "no-store",
    },
  })
}
