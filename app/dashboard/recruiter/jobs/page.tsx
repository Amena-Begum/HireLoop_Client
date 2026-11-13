import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { BriefcaseBusinessIcon, EyeIcon, PlusIcon, UsersIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { getJobsCollection, type JobDoc } from "@/lib/mongo"
import { buildJobSearchFilter } from "@/lib/search"
import { JobActions } from "@/components/jobs/job-actions"
import { PageHeader, PageHeaderAction } from "@/components/dashboard/page-header"
import { EmptyState } from "@/components/dashboard/empty-state"
import { StatusPill } from "@/components/status-pill"

export const metadata: Metadata = {
  title: "Manage Jobs",
  description: "Create, edit, and close your job posts on HireLoop.",
}

// Reads the live session + database on every request.
export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })

/** "€100,000 – €150,000" style label from the saved salary fields, or an em dash. */
function salaryLabel(job: JobDoc) {
  if (!job.salaryMin && !job.salaryMax) return "—"
  const fmt = (n: number) => `${job.currency}${n.toLocaleString()}`
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`
  return job.salaryMin ? `${fmt(job.salaryMin)}+` : `up to ${fmt(job.salaryMax as number)}`
}

const ManageJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) => {
  const { q } = await searchParams
  const query = typeof q === "string" ? q.trim().slice(0, 100) : ""

  const session = await auth.api.getSession({ headers: await headers() })
  const jobs: JobDoc[] = session
    ? await (async () => {
        const jobsCollection = await getJobsCollection()
        const filter: Record<string, unknown> = {
          postedById: session.user.id,
        }
        if (query) {
          // ref is a string field — regex works on it like the text fields.
          Object.assign(filter, buildJobSearchFilter(query, ["ref"]))
        }
        return jobsCollection
          .find(filter)
          .sort({ postedAt: -1 })
          .limit(50)
          .toArray()
      })()
    : []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Jobs"
        description="Create, edit, and close your job posts."
        action={
          <PageHeaderAction href="/dashboard/recruiter/jobs/create">
            <PlusIcon className="size-4" />
            Create Job Post
          </PageHeaderAction>
        }
      />

      {jobs.length > 0 ? (
        /* Jobs table — real posts from the database */
        <section className="rounded-xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium sm:px-6">Job Title</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">
                    Location
                  </th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">
                    Salary
                  </th>
                  <th className="px-5 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <UsersIcon className="size-3.5" />
                      Applicants
                    </span>
                  </th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <EyeIcon className="size-3.5" />
                      Views
                    </span>
                  </th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">
                    Posted
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.ref}
                    className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <span className="grid gap-0.5">
                        <span className="font-medium text-foreground">
                          {job.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <span className="font-mono">{job.ref}</span>
                          {" · "}
                          {job.company || "Confidential"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {job.employmentType} · {job.workMode}
                        </span>
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                      {job.location}
                    </td>
                    <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                      {salaryLabel(job)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                      {job.applicantCount}
                    </td>
                    <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                      {job.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={job.status} />
                    </td>
                    <td className="px-5 py-4">
                      <JobActions jobRef={job.ref} title={job.title} />
                    </td>
                    <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                      {dateFormat.format(job.postedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* Empty state — no posts yet for this recruiter */
        <EmptyState
          icon={BriefcaseBusinessIcon}
          title="No job posts yet"
          message={
            session
              ? "Create your first job post and it will show up here instantly."
              : "Sign in with a recruiter account and your job posts will show up here."
          }
        >
          <Link
            href="/dashboard/recruiter/jobs/create"
            className="mt-2 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <PlusIcon className="size-4" />
            Create Job Post
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

export default ManageJobsPage
