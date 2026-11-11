import type { Metadata } from "next"
import Link from "next/link"
import {
  BriefcaseBusinessIcon,
  BuildingIcon,
  DownloadIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

const stats = [
  {
    label: "Total Users",
    value: "124,892",
    change: "+12%",
    icon: UsersIcon,
    tone: "primary",
  },
  {
    label: "Total Recruiters",
    value: "12,405",
    change: "+8%",
    icon: BriefcaseBusinessIcon,
    tone: "primary",
  },
  {
    label: "Total Companies",
    value: "4,281",
    change: "0%",
    icon: BuildingIcon,
    tone: "muted",
  },
  {
    label: "Jobs Posted",
    value: "8,920",
    change: "+24%",
    icon: FileTextIcon,
    tone: "primary",
  },
  {
    label: "Platform Revenue",
    value: "$245,800",
    change: "+18.5%",
    icon: WalletIcon,
    tone: "primary",
  },
] as const

const transactions = [
  {
    user: "marcus.k@techcorp.io",
    company: "TechCorp Inc.",
    plan: "Enterprise Monthly",
    txn: "#TXN-902341",
    amount: "$1,299.00",
    date: "Oct 24, 2023, 14:20",
    status: "Success",
  },
  {
    user: "sarah.l@creativestudio.com",
    company: "Creative Studio",
    plan: "Professional Annual",
    txn: "#TXN-882103",
    amount: "$499.00",
    date: "Oct 24, 2023, 11:05",
    status: "Success",
  },
  {
    user: "j.doe@freelance.org",
    company: "Independent",
    plan: "Starter Monthly",
    txn: "#TXN-774129",
    amount: "$49.00",
    date: "Oct 23, 2023, 16:45",
    status: "Pending",
  },
  {
    user: "admin@retailglobal.net",
    company: "Retail Global",
    plan: "Enterprise Monthly",
    txn: "#TXN-552014",
    amount: "$1,299.00",
    date: "Oct 23, 2023, 09:12",
    status: "Failed",
  },
] as const

const pillStyles: Record<(typeof transactions)[number]["status"], string> = {
  Success: "bg-emerald-500/15 text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Failed: "bg-red-500/15 text-red-400",
}

const toneClasses: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
}

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "HireLoop platform overview for administrators.",
}

function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time platform performance and growth metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Last 30 Days
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <DownloadIcon className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats row */}
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                aria-hidden="true"
                className={`grid size-9 place-items-center rounded-lg ${toneClasses[stat.tone]}`}
              >
                <stat.icon className="size-4" />
              </span>
              <StatBadge value={stat.change} />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </li>
        ))}
      </ul>

      {/* Recent subscription transactions */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Subscription Transactions
          </h2>
          <Link
            href="/dashboard/admin/payments"
            className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
          >
            View All Activity
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">User / Recruiter</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Plan Type
                </th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Transaction ID
                </th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Date
                </th>
                <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.txn}
                  className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <span className="grid gap-0.5">
                      <span className="font-medium text-foreground">
                        {transaction.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transaction.company}
                      </span>
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground md:table-cell">
                    {transaction.plan}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-4 font-mono text-xs text-muted-foreground lg:table-cell">
                    {transaction.txn}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-foreground">
                    {transaction.amount}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground lg:table-cell">
                    {transaction.date}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${pillStyles[transaction.status]}`}
                    >
                      {transaction.status}
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

function StatBadge({ value }: { value: string }) {
  const isUp = value.startsWith("+")
  const isFlat = value.startsWith("0")

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isFlat ? "bg-muted text-muted-foreground" : "bg-emerald-500/15 text-emerald-400"
      }`}
    >
      {isUp && <TrendingUpIcon className="size-3" />}
      {value}
    </span>
  )
}

export default AdminDashboardPage
