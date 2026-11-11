import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon, CreditCardIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Subscription & Billing",
  description: "Manage your plan, payment method, and billing history.",
}

const planFeatures = [
  "Unlimited Applications",
  "Premium Job Insights",
  "Priority Candidate Badge",
  "Direct Recruiter Messaging",
] as const

const billingHistory = [
  {
    date: "Sep 24, 2023",
    plan: "Professional Tier",
    amount: "$29.00",
    txn: "TRX-948102-HL",
    status: "Paid",
  },
  {
    date: "Aug 24, 2023",
    plan: "Professional Tier",
    amount: "$29.00",
    txn: "TRX-771920-HL",
    status: "Paid",
  },
  {
    date: "Jul 24, 2023",
    plan: "Professional Tier",
    amount: "$29.00",
    txn: "TRX-331005-HL",
    status: "Paid",
  },
  {
    date: "Jun 24, 2023",
    plan: "Standard Tier",
    amount: "$12.00",
    txn: "TRX-220199-HL",
    status: "Paid",
  },
] as const

const SeekerBillingPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Subscription &amp; Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your professional tier features, recurring payments, and
          billing history.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          {/* Current plan */}
          <section className="rounded-xl border border-primary/40 bg-primary/10 p-6">
            <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
              Current Plan
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <SparklesIcon className="size-5 text-primary" />
                  Professional Tier
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Unlock global job insights and unlimited applications.
                </p>
              </div>
              <p className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  $29
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </p>
            </div>

            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid size-4.5 shrink-0 place-items-center rounded-full bg-primary/25 text-primary"
                  >
                    <CheckIcon className="size-3" />
                  </span>
                  <span className="text-sm text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Upgrade Plan
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Manage Plan
              </button>
              <span className="text-xs text-muted-foreground">
                Next billing date: Oct 24, 2023
              </span>
            </div>
          </section>

          {/* Billing history */}
          <section className="rounded-xl border border-border/60 bg-card">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight">
                Billing History
              </h2>
              <button
                type="button"
                className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
              >
                Export PDF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium sm:px-6">Date</th>
                    <th className="px-5 py-3 font-medium">Plan</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Transaction ID
                    </th>
                    <th className="px-5 py-3 font-medium sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((entry) => (
                    <tr
                      key={entry.txn}
                      className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                    >
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground sm:px-6">
                        {entry.date}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                        {entry.plan}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">
                        {entry.amount}
                      </td>
                      <td className="hidden px-5 py-4 whitespace-nowrap font-mono text-xs text-muted-foreground md:table-cell">
                        {entry.txn}
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Payment method */}
          <section className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">
                Payment Method
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                <ShieldCheckIcon className="size-3.5 text-emerald-400" />
                Secure by Stripe
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-gradient-to-br from-primary/80 to-[#3f34b8] p-5 text-primary-foreground">
              <p className="font-mono text-sm tracking-widest">
                VISA ·• ·• ·• ·• 4242
              </p>
              <div className="mt-6 flex items-center justify-between text-xs">
                <span className="grid gap-0.5">
                  <span className="text-primary-foreground/60 uppercase">
                    Card Holder
                  </span>
                  Alexander Seeker
                </span>
                <span className="grid gap-0.5">
                  <span className="text-primary-foreground/60 uppercase">
                    Expires
                  </span>
                  12/25
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <CreditCardIcon className="size-4" />
              Add New Payment Method
            </button>
          </section>

          {/* Support */}
          <section className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">
              Need help with your invoice?
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Our support team is available 24/7 to help you resolve any
              payment issues or clarify billing details.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Contact Support
              </button>
              <Link
                href="/pricing"
                className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
              >
                Read Refund Policy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SeekerBillingPage
