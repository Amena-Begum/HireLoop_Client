import type { Metadata } from "next"
import Link from "next/link"
import {
  BriefcaseBusinessIcon,
  CheckCircleIcon,
  Clock4Icon,
  FileTextIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard, StatGrid } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/status-pill"

const stats = [
  { label: "Total Job Posts", value: "48", icon: FileTextIcon, trend: "+6%" },
  { label: "Total Applicants", value: "1,284", icon: UsersIcon, trend: "+14%" },
  { label: "Active Jobs", value: "18", icon: BriefcaseBusinessIcon, trend: null },
  { label: "Jobs Closed", value: "32", icon: CheckCircleIcon, trend: null },
] as const

const applications = [
  {
    name: "Amara Okafor",
    role: "Senior Product Designer",
    date: "Oct 24, 2023",
    experience: "6 years",
    status: "Shortlisted",
  },
  {
    name: "Daniel Reyes",
    role: "Backend Engineer",
    date: "Oct 23, 2023",
    experience: "4 years",
    status: "Under Review",
  },
  {
    name: "Priya Nair",
    role: "Marketing Lead",
    date: "Oct 22, 2023",
    experience: "8 years",
    status: "Interview Scheduled",
  },
  {
    name: "Jonas Weber",
    role: "Product Manager",
    date: "Oct 21, 2023",
    experience: "5 years",
    status: "Under Review",
  },
] as const

export const metadata: Metadata = {
  title: "Recruiter Dashboard",
  description: "Your HireLoop recruiter dashboard.",
}

function RecruiterDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome header */}
      <PageHeader
        title="Welcome back, Alex Sterling"
        description="Here's an overview of your hiring activity."
      />

      {/* Stats row */}
      <StatGrid>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            trend={stat.trend ?? undefined}
          />
        ))}
      </StatGrid>

      {/* 2/3 + 1/3 grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent applications (2/3) */}
        <section className="rounded-xl border border-border/60 bg-card xl:col-span-2">
          <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent Applications
            </h2>
            <Link
              href="/dashboard/recruiter/applications"
              className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium sm:px-6">Candidate Name</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Date Applied</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">
                    Experience
                  </th>
                  <th className="px-5 py-3 font-medium sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.name}
                    className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                  >
                    <td className="px-5 py-4 font-medium text-foreground sm:px-6">
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
                    <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                      {application.role}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                      {application.date}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground md:table-cell">
                      {application.experience}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <StatusPill status={application.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right column (1/3) */}
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-primary/30 bg-primary/10 p-6">
            <h2 className="text-base font-semibold text-foreground">
              Post a new job
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Reach over 50,000 active job seekers in minutes.
            </p>
            <Link
              href="/dashboard/recruiter/jobs/create"
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <PlusIcon className="size-4" />
              Create Job Post
            </Link>
          </section>

          <section className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Clock4Icon className="size-4 text-primary" />
              Under review
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              2 applications from yesterday are still waiting for your decision.
            </p>
            <Link
              href="/dashboard/recruiter/applications"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
            >
              Review now
            </Link>
          </section>

          <section className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <XCircleIcon className="size-4 text-red-400" />
              Jobs closing soon
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              2 job posts expire within 7 days. Extend them to keep the pipeline
              open.
            </p>
            <Link
              href="/dashboard/recruiter/jobs"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
            >
              Manage jobs
            </Link>
          </section>
        </div>
      </div>

      {/* FAB - contextual */}
      <Link
        href="/dashboard/recruiter/jobs/create"
        aria-label="Create job post"
        className="fixed right-6 bottom-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_-8px_rgba(91,76,245,0.6)] transition-transform hover:scale-105"
      >
        <PlusIcon className="size-5" />
        Create Job Post
      </Link>
    </div>
  )
}

export default RecruiterDashboardPage
