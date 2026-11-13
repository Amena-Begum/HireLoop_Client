import type { Metadata } from "next"
import { headers } from "next/headers"
import { FileTextIcon, SearchXIcon, StarIcon, UsersIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { getApplicationsCollection, type ApplicationDoc } from "@/lib/mongo"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard, StatGrid } from "@/components/dashboard/stat-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { StatusPill } from "@/components/status-pill"

export const metadata: Metadata = {
  title: "Applications",
  description: "Review and manage applications to your job posts.",
}

// Reads live applications to this recruiter's job posts.
export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

const RecruiterApplicationsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  const applications: ApplicationDoc[] = session
    ? await (
        await getApplicationsCollection()
      )
        .find({ recruiterId: session.user.id })
        .sort({ appliedAt: -1 })
        .limit(100)
        .toArray()
    : []

  const count = (status: string) =>
    applications.filter((a) => a.status === status).length

  const stats = [
    { label: "Total Applicants", value: String(applications.length), icon: UsersIcon },
    { label: "New", value: String(count("New")), icon: FileTextIcon },
    { label: "Shortlisted", value: String(count("Shortlisted")), icon: StarIcon },
    { label: "Rejected", value: String(count("Rejected")), icon: UsersIcon },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Applications"
        description="Everyone who applied to your job posts, newest first."
      />

      {applications.length > 0 ? (
        <>
          {/* Pipeline stats */}
          <StatGrid>
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </StatGrid>

          {/* Applications table */}
          <section className="rounded-xl border border-border/60 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium sm:px-6">Candidate</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Email
                    </th>
                    <th className="px-5 py-3 font-medium">Applied For</th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">
                      Applied On
                    </th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.jobRef + application.seekerId}
                      className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                    >
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground sm:px-6">
                        <span className="flex items-center gap-3">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                            {application.seekerName
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                          {application.seekerName}
                        </span>
                      </td>
                      <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                        {application.seekerEmail}
                      </td>
                      <td className="px-5 py-4">
                        <span className="grid gap-0.5">
                          <span className="font-medium text-foreground">
                            {application.jobTitle}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {application.jobRef}
                            {application.company ? ` · ${application.company}` : ""}
                          </span>
                        </span>
                      </td>
                      <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                        {dateFormat.format(application.appliedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={application.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        /* Empty state */
        <EmptyState
          icon={SearchXIcon}
          title="No applications yet"
          message="When job seekers apply to your posts, they appear here instantly — name, email, and the job they applied for."
        />
      )}
    </div>
  )
}

export default RecruiterApplicationsPage
