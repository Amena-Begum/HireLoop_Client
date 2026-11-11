import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheckIcon, FileTextIcon, TargetIcon, TrophyIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "My Applications",
  description: "Track your job applications and interview progress in real-time.",
}

const stats = [
  { label: "Total Applied", value: "24", icon: FileTextIcon, hint: "all time" },
  { label: "Shortlisted", value: "8", icon: TargetIcon, hint: "in review" },
  { label: "Interviews", value: "3", icon: CalendarCheckIcon, hint: "scheduled" },
  { label: "Success Rate", value: "12%", icon: TrophyIcon, hint: "offers per application" },
] as const

const applications = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    meta: "Full-time • Remote",
    company: "Stark Industries",
    applied: "2 hours ago",
    status: "Under Review",
  },
  {
    id: 2,
    title: "Product Designer",
    meta: "Contract • Hybrid",
    company: "Cyberdyne Systems",
    applied: "1 day ago",
    status: "Shortlisted",
  },
  {
    id: 3,
    title: "Lead Data Scientist",
    meta: "Full-time • On-site",
    company: "Wayne Enterprises",
    applied: "4 days ago",
    status: "Interview",
  },
  {
    id: 4,
    title: "Cloud Architect",
    meta: "Full-time • Hybrid",
    company: "Oscorp Tech",
    applied: "1 week ago",
    status: "Rejected",
  },
  {
    id: 5,
    title: "AI Research Engineer",
    meta: "Full-time • Hybrid",
    company: "Hooli Corp",
    applied: "2 weeks ago",
    status: "Offered",
  },
] as const

const statusStyles: Record<string, string> = {
  "Under Review": "bg-amber-500/15 text-amber-400",
  Shortlisted: "bg-emerald-500/15 text-emerald-400",
  Interview: "bg-primary/15 text-primary",
  Rejected: "bg-red-500/15 text-red-400",
  Offered: "bg-sky-500/15 text-sky-400",
}

const SeekerApplicationsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your job applications and interview progress in real-time.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center rounded-lg border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Export PDF
        </button>
      </div>

      {/* Stats */}
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
              <span className="text-xs text-muted-foreground/70">
                {stat.hint}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Tabs */}
      <div className="flex w-fit gap-1 rounded-full bg-muted p-1">
        <button
          type="button"
          aria-pressed="true"
          className="rounded-full bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm"
        >
          Active
        </button>
        <button
          type="button"
          className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Archived
        </button>
      </div>

      {/* Applications table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">Job Title</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Applied
                </th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium sm:px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <span className="grid gap-0.5">
                      <span className="font-medium text-foreground">
                        {application.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {application.meta}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {application.company}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {application.applied}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[application.status]}`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right sm:px-6">
                    <Link
                      href="/dashboard/seeker"
                      className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-border/60 p-4 text-center text-xs text-muted-foreground">
          Showing 1-5 of 24 applications
        </p>
      </section>
    </div>
  )
}

export default SeekerApplicationsPage
