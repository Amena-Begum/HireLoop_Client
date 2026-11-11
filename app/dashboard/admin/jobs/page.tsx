import type { Metadata } from "next"
import { EyeIcon, HeartIcon, TimerIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Manage Jobs",
  description: "Review, edit, and moderate all job posts across the platform.",
}

const stats = [
  { label: "Engagement", value: "82.4%", icon: EyeIcon, hint: "avg. view rate" },
  { label: "Time to Fill", value: "14 Days", icon: TimerIcon, hint: "open to closed" },
  { label: "Applications", value: "12,840", icon: HeartIcon, hint: "this quarter" },
] as const

const jobs = [
  {
    ref: "HL-90210",
    title: "Senior Product Designer",
    company: "Nexus Lab",
    applications: 128,
    posted: "Oct 02, 2023",
    status: "Active",
  },
  {
    ref: "HL-88231",
    title: "Full-stack Engineer",
    company: "Quantum",
    applications: 342,
    posted: "Sep 18, 2023",
    status: "Active",
  },
  {
    ref: "HL-11022",
    title: "Marketing Director",
    company: "Vanguard",
    applications: 96,
    posted: "Sep 05, 2023",
    status: "Paused",
  },
  {
    ref: "HL-99032",
    title: "Backend Architect",
    company: "CloudScale",
    applications: 214,
    posted: "Aug 29, 2023",
    status: "Active",
  },
  {
    ref: "HL-44112",
    title: "UX Research Lead",
    company: "Humanize",
    applications: 57,
    posted: "Aug 11, 2023",
    status: "Closed",
  },
] as const

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  Paused: "bg-amber-500/15 text-amber-400",
  Closed: "bg-muted text-muted-foreground",
}

const AdminJobsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manage Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, edit, and moderate all job posts across the platform.
        </p>
      </div>

      {/* Stats */}
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5"
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary"
            >
              <stat.icon className="size-4" />
            </span>
            <span className="text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
              {stat.value}
            </span>
            <span className="grid">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className="text-xs text-muted-foreground/70">
                {stat.hint}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Jobs table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">Ref</th>
                <th className="px-5 py-3 font-medium">Job Title</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Applications
                </th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Posted
                </th>
                <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.ref}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-muted-foreground sm:px-6">
                    {job.ref}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                    {job.title}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {job.company}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {job.applications}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {job.posted}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-border/60 p-4 text-center text-xs text-muted-foreground">
          Showing 1-5 of 1,248 job posts
        </p>
      </section>
    </div>
  )
}

export default AdminJobsPage
