import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { EuroIcon, MapPinIcon, SearchXIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import {
  getApplicationsCollection,
  getJobsCollection,
  getSavedJobsCollection,
} from "@/lib/mongo"
import { buildJobSearchFilter } from "@/lib/search"
import { ApplyButton } from "@/components/jobs/apply-button"
import { SaveButton } from "@/components/jobs/save-button"
import { JobSearch } from "@/components/jobs/job-search"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"

export const metadata: Metadata = {
  title: "Find Jobs",
  description: "Discover jobs matched to your profile.",
}

// Reads live job data from the database on every request.
export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

const SeekerJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) => {
  const { q } = await searchParams
  const query = typeof q === "string" ? q.trim().slice(0, 100) : ""

  const session = await auth.api.getSession({ headers: await headers() })

  // Active jobs, filtered by the search query when one is present.
  const filter: Record<string, unknown> = { status: "Active" }
  if (query) {
    // $regex on an array field (skills) matches any element.
    Object.assign(filter, buildJobSearchFilter(query, ["skills"]))
  }

  const jobs = await (
    await getJobsCollection()
  )
    .find(filter)
    .sort({ postedAt: -1 })
    .limit(50)
    .toArray()

  // Jobs this seeker already applied to, so buttons render as "Applied".
  const appliedRefs = new Set<string>(
    session
      ? (
          await (
            await getApplicationsCollection()
          )
            .find({ seekerId: session.user.id })
            .project({ jobRef: 1 })
            .toArray()
        ).map((row) => row.jobRef)
      : []
  )

  // Jobs this seeker bookmarked, so Save buttons render as "Saved".
  const savedRefs = new Set<string>(
    session
      ? (
          await (
            await getSavedJobsCollection()
          )
            .find({ userId: session.user.id })
            .project({ jobRef: 1 })
            .toArray()
        ).map((row) => row.jobRef)
      : []
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Find Jobs"
        description="Discover roles posted by recruiters on HireLoop."
      />

      {/* Search — URL-driven; the list above re-renders with ?q= */}
      <JobSearch placeholder="Search for opportunities..." />

      {jobs.length > 0 && query ? (
        <p className="text-sm text-muted-foreground">
          {jobs.length} job{jobs.length === 1 ? "" : "s"} matching{" "}
          <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
        </p>
      ) : null}

      {jobs.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => {
            const salary = job.salaryMin || job.salaryMax
              ? [
                  job.salaryMin ? `${job.currency}${job.salaryMin.toLocaleString()}` : null,
                  job.salaryMax ? `${job.currency}${job.salaryMax.toLocaleString()}` : null,
                ]
                  .filter(Boolean)
                  .join(" – ")
              : null
            return (
              <li key={job.ref}>
                <article className="flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-card p-6 transition-colors hover:bg-card/90">
                  <div className="grid content-start gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold tracking-tight text-foreground">
                        {job.title}
                      </h2>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {job.ref}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brand-soft">
                      {job.company || "Confidential"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                      <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                      {job.location} ({job.workMode})
                    </span>
                    {salary ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                        <EuroIcon className="size-3.5 shrink-0 text-primary" />
                        {salary} · {job.employmentType}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                        {job.employmentType}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {job.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <span
                      className="shrink-0 text-xs text-muted-foreground"
                      title={dateFormat.format(job.postedAt)}
                    >
                      {job.applicantCount} applicant
                      {job.applicantCount === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-2">
                      <SaveButton
                        jobRef={job.ref}
                        saved={savedRefs.has(job.ref)}
                      />
                      <ApplyButton
                        jobRef={job.ref}
                        applied={appliedRefs.has(job.ref)}
                        closed={false}
                      />
                    </span>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      ) : query ? (
        /* Empty state — no jobs match the current search */
        <EmptyState
          icon={SearchXIcon}
          title="No jobs match your search"
          message={`Nothing found for \u201C${query}\u201D. Try different keywords — or clear the search to browse everything.`}
        >
          <Link
            href="/dashboard/seeker/jobs"
            className="mt-2 inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Clear search
          </Link>
        </EmptyState>
      ) : (
        /* Empty state — no active jobs posted yet */
        <EmptyState
          icon={SearchXIcon}
          title="No open jobs right now"
          message="New jobs appear here as soon as recruiters post them — check back soon."
        />
      )}
    </div>
  )
}

export default SeekerJobsPage
