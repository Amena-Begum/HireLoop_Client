import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { BookmarkIcon, Clock3Icon, SearchXIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { getJobsCollection, getSavedJobsCollection } from "@/lib/mongo"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard, StatGrid } from "@/components/dashboard/stat-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { RemoveSavedButton } from "@/components/jobs/remove-saved-button"

export const metadata: Metadata = {
  title: "Saved Jobs",
  description: "Manage and track your bookmarked opportunities.",
}

// Reads the signed-in seeker's live bookmarks on every request.
export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
})

function relativeSavedAt(date: Date) {
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
  if (minutes < 1) return "Saved just now"
  if (minutes < 60) {
    return `Saved ${minutes} minute${minutes === 1 ? "" : "s"} ago`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Saved ${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `Saved ${days} day${days === 1 ? "" : "s"} ago`
  const weeks = Math.round(days / 7)
  if (weeks < 5) return `Saved ${weeks} week${weeks === 1 ? "" : "s"} ago`
  return `Saved on ${dateFormat.format(date)}`
}

const SeekerSavedPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  const savedJobs = session
    ? await (await getSavedJobsCollection())
        .find({ userId: session.user.id })
        .sort({ savedAt: -1 })
        .limit(100)
        .toArray()
    : []

  // Join with the jobs collection for title/company/status.
  const refs = savedJobs.map((row) => row.jobRef)
  const jobMap = new Map(
    refs.length
      ? (
          await (await getJobsCollection())
            .find({ ref: { $in: refs } })
            .toArray()
        ).map((job) => [job.ref, job])
      : []
  )

  const rows = savedJobs
    .map((saved) => {
      const job = jobMap.get(saved.jobRef)
      if (!job) return null
      const salary =
        job.salaryMin || job.salaryMax
          ? [
              job.salaryMin
                ? `${job.currency}${job.salaryMin.toLocaleString()}`
                : null,
              job.salaryMax
                ? `${job.currency}${job.salaryMax.toLocaleString()}`
                : null,
            ]
              .filter(Boolean)
              .join(" – ")
          : null
      return { saved, job, salary }
    })
    .filter((row) => row !== null)

  const openCount = rows.filter(
    (row) => row.job.status === "Active"
  ).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Saved Jobs"
        description="Manage and track your bookmarked opportunities."
      />

      {rows.length > 0 ? (
        <>
          {/* Stats */}
          <StatGrid>
            <StatCard
              icon={BookmarkIcon}
              value={String(rows.length)}
              label="Total Saved"
            />
            <StatCard
              icon={Clock3Icon}
              value={String(openCount)}
              label="Still Open"
              iconClassName="bg-amber-500/15 text-amber-400"
            />
          </StatGrid>

          {/* Sort note */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">
              {rows.length} saved job{rows.length === 1 ? "" : "s"}
            </span>
            <span className="text-sm text-muted-foreground">
              Sort by:{" "}
              <span className="font-medium text-foreground">
                Recently Saved
              </span>
            </span>
          </div>

          {/* Saved jobs list */}
          <ul className="flex flex-col gap-4">
            {rows.map(({ saved, job, salary }) => {
              const closed = job.status !== "Active"
              return (
                <li
                  key={job.ref}
                  className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="grid min-w-0 gap-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-semibold tracking-tight text-foreground">
                        {job.title}
                      </h2>
                      <span
                        className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                          closed
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {closed ? "Closed" : "Open"}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {job.ref}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brand-soft">
                      {job.company || "Confidential"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.location} ({job.workMode})
                      {salary ? ` · ${salary}` : null}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {relativeSavedAt(saved.savedAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <Link
                      href="/dashboard/seeker/jobs"
                      className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
                        closed
                          ? "pointer-events-none border border-border/60 text-muted-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/80"
                      }`}
                    >
                      {closed ? "Closed" : "Apply Now"}
                    </Link>
                    <RemoveSavedButton jobRef={job.ref} />
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      ) : (
        <EmptyState
          icon={SearchXIcon}
          title="No saved jobs yet"
          message={
            session
              ? "Tap the Save button on any job in the Find Jobs page and it will show up here."
              : "Sign in with a job seeker account to bookmark jobs."
          }
        >
          <Link
            href="/dashboard/seeker/jobs"
            className="mt-2 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Browse Jobs
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

export default SeekerSavedPage
