import type { Metadata } from "next"
import { BanIcon, Building2Icon, CheckCircle2Icon, Trash2Icon } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard, StatGrid } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/status-pill"

export const metadata: Metadata = {
  title: "Manage Companies",
  description: "Review, verify, and manage all company accounts on the platform.",
}

const stats = [
  { label: "Total Companies", value: "3,218", hint: "+64 this month" },
  { label: "Active Postings", value: "1,248", hint: "across all plans" },
  { label: "Pending Verification", value: "27", hint: "need review" },
  { label: "Enterprise Clients", value: "842", hint: "custom contracts" },
] as const

const companies = [
  {
    name: "CloudScale AI",
    industry: "AI / Cloud",
    location: "New York, USA",
    plan: "Enterprise",
    openJobs: 12,
    status: "Verified",
  },
  {
    name: "FinGrid",
    industry: "Fintech",
    location: "Remote · Europe",
    plan: "Professional",
    openJobs: 8,
    status: "Verified",
  },
  {
    name: "TechFlow",
    industry: "SaaS",
    location: "London, UK",
    plan: "Professional",
    openJobs: 6,
    status: "Verified",
  },
  {
    name: "Nexus Lab",
    industry: "Product Design",
    location: "San Francisco, USA",
    plan: "Professional",
    openJobs: 3,
    status: "Pending",
  },
  {
    name: "Quantum",
    industry: "Engineering",
    location: "Austin, USA",
    plan: "Professional",
    openJobs: 5,
    status: "Verified",
  },
  {
    name: "Vanguard",
    industry: "Marketing",
    location: "Chicago, USA",
    plan: "Free",
    openJobs: 1,
    status: "Suspended",
  },
  {
    name: "Humanize",
    industry: "UX Research",
    location: "Remote · Global",
    plan: "Free",
    openJobs: 2,
    status: "Verified",
  },
] as const

const AdminCompaniesPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Companies"
        description="Review, verify, and manage all company accounts on the platform."
        action={
          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Export List
          </button>
        }
      />

      {/* Stats */}
      <StatGrid>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            hint={stat.hint}
          />
        ))}
      </StatGrid>

      {/* Companies table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">Company</th>
                <th className="px-5 py-3 font-medium">Industry</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Location
                </th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Open Jobs
                </th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.name}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground sm:px-6">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary"
                      >
                        <Building2Icon className="size-4" />
                      </span>
                      {company.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {company.industry}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {company.location}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={company.plan} />
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {company.openJobs}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={company.status} />
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      {company.status === "Pending" ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:underline"
                        >
                          <CheckCircle2Icon className="size-3.5" />
                          Verify
                        </button>
                      ) : null}
                      {company.status === "Suspended" ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:underline"
                        >
                          <CheckCircle2Icon className="size-3.5" />
                          Reinstate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:underline"
                        >
                          <BanIcon className="size-3.5" />
                          Suspend
                        </button>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:underline"
                      >
                        <Trash2Icon className="size-3.5" />
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-border/60 p-4 text-center text-xs text-muted-foreground">
          Showing 1-7 of 3,218 companies
        </p>
      </section>
    </div>
  )
}

export default AdminCompaniesPage
