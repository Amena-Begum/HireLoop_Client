import type { Metadata } from "next"
import Link from "next/link"
import { SearchXIcon, UsersIcon } from "lucide-react"

import { getJobsCollection, type JobDoc } from "@/lib/mongo"
import {
  applyJobFilters,
  hasActiveFilters,
  parseJobFilters,
} from "@/lib/job-filters"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilterSidebar, JobSearch } from "@/components/jobs/job-filters"

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Browse every active job opening on HireLoop — filter by work mode, job type, location, and salary to find the right role for you.",
}

// Reads live job data from the database on every request.
export const dynamic = "force-dynamic"

const JobsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) => {
  const params = (await searchParams) ?? {}
  const filters = parseJobFilters(params)

  // Every active posting, newest first — filtering happens below.
  const allJobs: JobDoc[] = await (
    await getJobsCollection()
  )
    .find({ status: "Active" })
    .sort({ postedAt: -1 })
    .limit(60)
    .toArray()

  const jobs = applyJobFilters(allJobs, filters)
  const filtered = hasActiveFilters(filters)

  return (
    <main className="min-h-svh py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Page header */}
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Browse Jobs
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {jobs.length} open role{jobs.length === 1 ? "" : "s"} from the
            teams that are hiring
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every posting comes straight from the hiring team — no ghost
            listings, no recruiter spam.
          </p>
        </div>

        {/* Keyword search */}
        <JobSearch values={filters} />

        {/* Filters + jobs grid */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <JobFilterSidebar values={filters} />

          {jobs.length === 0 ? (
            <div className="rounded-xl bg-card p-8 text-center">
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <SearchXIcon className="size-4" />
                No roles match your filters right now.
              </p>
              {filtered ? (
                <Link
                  href="/jobs"
                  className="mt-3 inline-block text-sm font-medium text-foreground transition-colors hover:text-brand-soft"
                >
                  Clear all filters
                </Link>
              ) : null}
            </div>
          ) : (
            <div>
              {filtered ? (
                <p className="mb-4 text-sm text-muted-foreground">
                  Showing {jobs.length} of {allJobs.length} open roles
                </p>
              ) : null}
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <li key={job.ref}>
                    <JobCard job={job} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 rounded-xl bg-card p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="hidden size-12 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary sm:grid"
            >
              <UsersIcon className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Can&apos;t find the right role?
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Build a profile in three minutes. The matches start arriving
                tomorrow morning.
              </p>
            </div>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create free account
          </Link>
        </div>
      </div>
    </main>
  )
}

export default JobsPage
