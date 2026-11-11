import type { Metadata } from "next"
import Link from "next/link"
import {
  BellIcon,
  BookmarkIcon,
  CalendarCheckIcon,
  ChevronRightIcon,
  FileTextIcon,
  HandshakeIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

const stats = [
  { label: "Saved Jobs", value: "12", icon: BookmarkIcon },
  { label: "Applications Submitted", value: "24", icon: FileTextIcon },
  { label: "Interviews Scheduled", value: "3", icon: CalendarCheckIcon },
  { label: "Offers Received", value: "1", icon: HandshakeIcon },
]

const activities = [
  {
    id: 1,
    icon: FileTextIcon,
    tone: "primary",
    title:
      "Application for Senior Product Designer at TechFlow updated to 'Under Review'",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: BellIcon,
    tone: "emerald",
    title: "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
  },
  {
    id: 3,
    icon: MessageCircleIcon,
    tone: "fuchsia",
    title:
      "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
  },
  {
    id: 4,
    icon: FileTextIcon,
    tone: "primary",
    title:
      "Application for Senior Product Designer at TechFlow updated to 'Under Review'",
    time: "2 hours ago",
  },
  {
    id: 5,
    icon: BellIcon,
    tone: "emerald",
    title: "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
  },
  {
    id: 6,
    icon: MessageCircleIcon,
    tone: "fuchsia",
    title: "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
  },
] as const

const toneClasses: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  emerald: "bg-emerald-500/15 text-emerald-400",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-400",
}

export const metadata: Metadata = {
  title: "Seeker Dashboard",
  description: "Your personal HireLoop dashboard.",
}

function SeekerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening on your job search today.
          </p>
        </div>
        <Link
          href="/dashboard/seeker/jobs"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <PlusIcon className="size-4" />
          Find a Job
        </Link>
      </div>

      {/* Stats row */}
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5"
          >
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"
            >
              <stat.icon className="size-5" />
            </span>
            <span className="grid gap-0.5">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Recent activity */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/seeker/applications"
            className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
          >
            View All Activity
          </Link>
        </div>

        <ul className="grid gap-2 p-4 sm:p-6 lg:grid-cols-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-center gap-4 rounded-lg border border-border/40 bg-muted/20 p-4 transition-colors hover:border-border"
            >
              <span
                aria-hidden="true"
                className={`grid size-10 shrink-0 place-items-center rounded-full ${toneClasses[activity.tone]}`}
              >
                <activity.icon className="size-4" />
              </span>
              <span className="grid min-w-0 gap-1">
                <span className="line-clamp-2 text-sm text-foreground">
                  {activity.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </span>
              <ChevronRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </section>

      {/* FAB (Only on Home-like Dashboard) */}
      <Link
        href="/dashboard/seeker/jobs"
        aria-label="Find a job"
        className="fixed right-6 bottom-6 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_32px_-8px_rgba(91,76,245,0.6)] transition-transform hover:scale-105"
      >
        <SearchIcon className="size-6" />
      </Link>
    </div>
  )
}

export default SeekerDashboardPage
