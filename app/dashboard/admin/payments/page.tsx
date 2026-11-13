import type { Metadata } from "next"
import { CreditCardIcon, TrendingUpIcon, UsersIcon } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard, StatGrid } from "@/components/dashboard/stat-card"
import { StatusPill } from "@/components/status-pill"

export const metadata: Metadata = {
  title: "Payments & Subscriptions",
  description: "Monitor revenue, subscriptions, and payment activity platform-wide.",
}

const stats = [
  {
    label: "Total Revenue",
    value: "$1,284,500",
    icon: TrendingUpIcon,
    hint: "all time",
  },
  {
    label: "Monthly Recurring",
    value: "$94,210",
    icon: CreditCardIcon,
    hint: "active subscriptions",
  },
  {
    label: "Pro Subscribers",
    value: "12,408",
    icon: UsersIcon,
    hint: "$29/mo tier",
  },
  {
    label: "Enterprise Clients",
    value: "842",
    icon: UsersIcon,
    hint: "custom contracts",
  },
] as const

const transactions = [
  {
    email: "jordan.daniels@enterprise.co",
    plan: "Enterprise",
    amount: "$4,500.00",
    txn: "TXN-882910443",
    date: "Oct 24, 2023",
    status: "Success",
  },
  {
    email: "sarah.k@techflow.io",
    plan: "Professional",
    amount: "$299.00",
    txn: "TXN-773410291",
    date: "Oct 23, 2023",
    status: "Success",
  },
  {
    email: "marcus.lee@gmail.com",
    plan: "Professional",
    amount: "$49.00",
    txn: "TXN-110294857",
    date: "Oct 23, 2023",
    status: "Pending",
  },
  {
    email: "e.lopez@globalfoundries.com",
    plan: "Enterprise",
    amount: "$12,000.00",
    txn: "TXN-009485712",
    date: "Oct 22, 2023",
    status: "Failed",
  },
] as const

const AdminPaymentsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payments & Subscriptions"
        description="Monitor revenue, subscriptions, and payment activity platform-wide."
      />

      {/* Stats */}
      <StatGrid>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            hint={stat.hint}
          />
        ))}
      </StatGrid>

      {/* Transactions table */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Transactions
          </h2>
          <button
            type="button"
            className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium sm:px-6">Customer</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Transaction ID
                </th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
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
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground sm:px-6">
                    {transaction.email}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                    {transaction.plan}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                    {transaction.amount}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap font-mono text-xs text-muted-foreground md:table-cell">
                    {transaction.txn}
                  </td>
                  <td className="hidden px-5 py-4 whitespace-nowrap text-muted-foreground md:table-cell">
                    {transaction.date}
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <StatusPill status={transaction.status} />
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

export default AdminPaymentsPage
