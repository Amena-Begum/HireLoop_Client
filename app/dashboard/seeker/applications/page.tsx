import type { Metadata } from "next"
import { headers } from "next/headers"
import { CalendarCheckIcon, FileTextIcon, SearchXIcon, TargetIcon, TrophyIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { getApplicationsCollection, type ApplicationDoc } from "@/lib/mongo"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard, StatGrid } from "@/components/dashboard/stat-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { StatusPill } from "@/components/status-pill"

export const metadata: Metadata = {
  title: "My Applications",
  description: "Track your job applications and interview progress in real-time.",
}

// Reads the signed-in seeker's live applications.
export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

const SeekerApplicationsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  const applications: ApplicationDoc[] = session
    ? await (
        await getApplicationsCollection()
      )
        .find({ seekerId: session.user.id })
        .sort({ appliedAt: -1 })
        .limit(100)
        .toArray()
    : []

  const count = (status: string) =>
    applications.filter((a) => a.status === status).length

  const stats = [
    { label: "Total Applied", value: String(applications.length), icon: FileTextIcon },
    { label: "New", value: String(count("New")), icon: TargetIcon },
    { label: "Shortlisted", value: String(count("Shortlisted")), icon: TrophyIcon },
    { label: "Under Review", value: String(count("Under Review")), icon: CalendarCheckIcon },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Applications"
        description="Track your job applications and interview progress in real-time."
      />

      {applications.length > 0 ? (
        <>
          {/* Stats */}
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
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium sm:px-6">Job Title</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Applied
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
                      <td className="px-5 py-4 sm:px-6">
                        <span className="grid gap-0.5">
                          <span className="font-medium text-foreground">
                            {application.jobTitle}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {application.jobRef}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                        {application.company || "Confidential"}
                      </td>
                      <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
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
          message="Apply to jobs from the Jobs page and they will show up here with their live status."
        />
      )}
    </div>
  )
}

export default SeekerApplicationsPage
