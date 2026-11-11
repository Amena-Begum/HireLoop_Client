import type { Metadata } from "next"
import Link from "next/link"
import { EyeIcon, FileTextIcon, StarIcon, UsersIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Applications",
  description: "Review and manage applications to your job posts.",
}

const applications = [
  {
    id: 1,
    name: "Amara Okafor",
    role: "Senior Product Designer",
    job: "Senior Product Designer",
    date: "Oct 24, 2023",
    experience: "6 years",
    status: "Shortlisted",
  },
  {
    id: 2,
    name: "Daniel Reyes",
    role: "Backend Engineer",
    job: "Backend Engineer",
    date: "Oct 23, 2023",
    experience: "4 years",
    status: "Under Review",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "Marketing Lead",
    job: "Growth Marketing Lead",
    date: "Oct 22, 2023",
    experience: "8 years",
    status: "Interview Scheduled",
  },
  {
    id: 4,
    name: "Jonas Weber",
    role: "Product Manager",
    job: "Product Manager",
    date: "Oct 21, 2023",
    experience: "5 years",
    status: "Under Review",
  },
  {
    id: 5,
    name: "Sofia Lindqvist",
    role: "Frontend Engineer",
    job: "Backend Engineer",
    date: "Oct 20, 2023",
    experience: "3 years",
    status: "New",
  },
  {
    id: 6,
    name: "Marcus Chen",
    role: "Full-stack Developer",
    job: "Senior Product Designer",
    date: "Oct 19, 2023",
    experience: "7 years",
    status: "Rejected",
  },
] as const

const statusStyles: Record<string, string> = {
  New: "bg-sky-500/15 text-sky-400",
  "Under Review": "bg-amber-500/15 text-amber-400",
  Shortlisted: "bg-emerald-500/15 text-emerald-400",
  "Interview Scheduled": "bg-primary/15 text-primary",
  Rejected: "bg-red-500/15 text-red-400",
}

const counts = [
  {
    label: "Total Applicants",
    value: "148",
    icon: UsersIcon,
    hint: "across 3 active jobs",
  },
  {
    label: "New",
    value: "23",
    icon: FileTextIcon,
    hint: "waiting for review",
  },
  {
    label: "Shortlisted",
    value: "9",
    icon: StarIcon,
    hint: "move them to interview",
  },
  {
    label: "Interviews",
    value: "4",
    icon: EyeIcon,
    hint: "scheduled this week",
  },
] as const

const RecruiterApplicationsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review candidates and move them through your pipeline.
        </p>
      </div>

      {/* Pipeline stats */}
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {counts.map((count) => (
          <li
            key={count.label}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary"
              >
                <count.icon className="size-4" />
              </span>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
              {count.value}
            </span>
            <span className="grid">
              <span className="text-xs text-muted-foreground">
                {count.label}
              </span>
              <span className="text-xs text-muted-foreground/70">
                {count.hint}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Applications table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            All applications
          </h2>
          <Link
            href="/dashboard/recruiter/jobs"
            className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
          >
            Manage jobs
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">
                  Candidate Name
                </th>
                <th className="px-5 py-3 font-medium">Applied For</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Date Applied
                </th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Experience
                </th>
                <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground sm:px-6">
                    <span className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                        {application.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      {application.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {application.job}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {application.date}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                    {application.experience}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[application.status]}`}
                    >
                      {application.status}
                    </span>
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

export default RecruiterApplicationsPage
