import type { Metadata } from "next"
import Link from "next/link"
import { EyeIcon, PlusIcon, UsersIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Manage Jobs",
  description: "Create, edit, and close your job posts on HireLoop.",
}

const jobPosts = [
  {
    id: 1,
    title: "Senior Product Designer",
    location: "London, UK",
    workMode: "Hybrid",
    type: "Full-time",
    applicants: 42,
    views: 1204,
    status: "Active",
    posted: "Oct 10, 2023",
  },
  {
    id: 2,
    title: "Backend Engineer",
    location: "Remote · Europe",
    workMode: "Remote",
    type: "Full-time",
    applicants: 28,
    views: 862,
    status: "Active",
    posted: "Oct 14, 2023",
  },
  {
    id: 3,
    title: "Marketing Lead",
    location: "Berlin, Germany",
    workMode: "On-site",
    type: "Full-time",
    applicants: 11,
    views: 430,
    status: "Draft",
    posted: "—",
  },
  {
    id: 4,
    title: "Product Manager",
    location: "Amsterdam, NL",
    workMode: "Hybrid",
    type: "Contract",
    applicants: 67,
    views: 2318,
    status: "Closed",
    posted: "Sep 02, 2023",
  },
] as const

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  Draft: "bg-amber-500/15 text-amber-400",
  Closed: "bg-muted text-muted-foreground",
}

const ManageJobsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and close your job posts.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/create"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <PlusIcon className="size-4" />
          Create Job Post
        </Link>
      </div>

      {/* Jobs table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">Job Title</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Location
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
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Posted
                </th>
              </tr>
            </thead>
            <tbody>
              {jobPosts.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <span className="grid gap-0.5">
                      <span className="font-medium text-foreground">
                        {job.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {job.type} · {job.workMode}
                      </span>
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {job.location}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                    {job.applicants}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                    {job.views.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                    {job.posted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ManageJobsPage
