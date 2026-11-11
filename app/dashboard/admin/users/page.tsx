import type { Metadata } from "next"
import { BanIcon, RefreshCcwIcon, Trash2Icon, UserRoundCogIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Manage Users",
  description: "Review, filter, and manage platform access for all users.",
}

const stats = [
  { label: "Total Active Users", value: "12,842", hint: "+12% vs last month" },
  { label: "Recruiter Growth", value: "843", hint: "High demand" },
  { label: "Suspended Accounts", value: "124", hint: "0.8% of total" },
  { label: "New Signups (24h)", value: "42", hint: "Steady activity" },
] as const

const users = [
  {
    name: "Jordan Davis",
    email: "jordan.davis@example.com",
    role: "Seeker",
    joined: "Oct 12, 2023",
    status: "Active",
    actions: ["make-recruiter", "suspend"],
  },
  {
    name: "Elena Rodriguez",
    email: "elena.r@talentflow.io",
    role: "Recruiter",
    joined: "Sep 28, 2023",
    status: "Active",
    actions: ["make-seeker", "suspend"],
  },
  {
    name: "Marcus Webb",
    email: "m.webb@outlook.com",
    role: "Seeker",
    joined: "Aug 05, 2023",
    status: "Suspended",
    actions: ["activate", "delete"],
  },
  {
    name: "Tom Hiddleston",
    email: "t.hiddles@loki-tech.com",
    role: "Recruiter",
    joined: "Nov 01, 2023",
    status: "Active",
    actions: ["make-seeker", "suspend"],
  },
] as const

const roleStyles: Record<string, string> = {
  Seeker: "bg-sky-500/15 text-sky-400",
  Recruiter: "bg-primary/15 text-primary",
}

const actionLabels: Record<string, { label: string; className: string; icon: typeof BanIcon }> = {
  "make-recruiter": {
    label: "Make Recruiter",
    className: "text-brand-soft hover:underline",
    icon: UserRoundCogIcon,
  },
  "make-seeker": {
    label: "Make Seeker",
    className: "text-brand-soft hover:underline",
    icon: UserRoundCogIcon,
  },
  suspend: {
    label: "Suspend",
    className: "text-amber-400 hover:underline",
    icon: BanIcon,
  },
  activate: {
    label: "Activate",
    className: "text-emerald-400 hover:underline",
    icon: RefreshCcwIcon,
  },
  delete: {
    label: "Delete",
    className: "text-red-400 hover:underline",
    icon: Trash2Icon,
  },
}

const AdminUsersPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, filter, and manage platform access for all users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            All Roles
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Export List
          </button>
        </div>
      </div>

      {/* Stats */}
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5"
          >
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

      {/* Users table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">User Name</th>
                <th className="px-5 py-3 font-medium">Email Address</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Join Date
                </th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.email}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground sm:px-6">
                    <span className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                      {user.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground lg:table-cell">
                    {user.joined}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {user.status}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      {user.actions.map((action) => {
                        const config = actionLabels[action]
                        return (
                          <button
                            key={action}
                            type="button"
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.className}`}
                          >
                            <config.icon className="size-3.5" />
                            {config.label}
                          </button>
                        )
                      })}
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

export default AdminUsersPage
