"use client"

import * as React from "react"

import {
  CheckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type PlanName = "Free" | "Professional" | "Enterprise"

type PaymentMethod = {
  brand: string
  last4: string
  holder: string
  expiry: string
}

// Plan catalogue mirrors the public /pricing page so the two stay in sync.
const PLANS: Record<
  PlanName,
  {
    price: string
    cadence: string
    description: string
    features: string[]
  }
> = {
  Free: {
    price: "$0",
    cadence: "forever",
    description: "Everything you need to start applying and tracking your search.",
    features: [
      "Unlimited job browsing & alerts",
      "5 applications per month",
      "Basic profile & resume upload",
      "Application status tracking",
    ],
  },
  Professional: {
    price: "$29",
    cadence: "per month",
    description: "Unlock global job insights and unlimited applications.",
    features: [
      "Unlimited Applications",
      "Premium Job Insights",
      "Priority Candidate Badge",
      "Direct Recruiter Messaging",
    ],
  },
  Enterprise: {
    price: "$1,299",
    cadence: "per month",
    description: "For hiring teams and talent agencies at scale.",
    features: [
      "Everything in Professional",
      "Unlimited job posts & seats",
      "Applicant pipeline & team notes",
      "Dedicated account manager",
    ],
  },
}

const TIER_LISTS: Record<PlanName, string[]> = {
  Free: PLANS.Free.features,
  Professional: [
    "Everything in Free",
    "Unlimited one-click applications",
    "Premium Job Insights & salary data",
    "Priority matching in recruiter search",
    "Interview preparedness resources",
  ],
  Enterprise: PLANS.Enterprise.features,
}

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

const formatCardNumber = (value: string) =>
  (value.replace(/\D/g, "").slice(0, 16).match(/.{1,4}/g) ?? []).join(" ")

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

const SeekerBillingPage = () => {
  const [planName, setPlanName] = React.useState<PlanName>("Professional")
  const [manageOpen, setManageOpen] = React.useState(false)
  const [paymentOpen, setPaymentOpen] = React.useState(false)
  const [refundOpen, setRefundOpen] = React.useState(false)
  const [pendingDowngrade, setPendingDowngrade] = React.useState(false)
  const [method, setMethod] = React.useState<PaymentMethod>({
    brand: "VISA",
    last4: "4242",
    holder: "Alexander Seeker",
    expiry: "12/25",
  })

  const plan = PLANS[planName]
  const isPaid = planName !== "Free"

  // TODO: wire plan changes to the billing API / Stripe checkout — for now the
  // switch is applied locally so the page is fully clickable end-to-end.
  const switchPlan = (target: PlanName) => {
    setPlanName(target)
    setPendingDowngrade(false)
    setManageOpen(false)
  }

  const exportCsv = () => {
    const rows = [
      ["Date", "Plan", "Amount", "Transaction ID", "Status"],
      ...billingHistory.map((entry) => [
        entry.date,
        entry.plan,
        entry.amount,
        entry.txn,
        entry.status,
      ]),
    ]
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "hireloop-billing-history.csv"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Subscription &amp; Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your tier features, recurring payments, and billing history.
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
                  {planName === "Free" ? "Free Plan" : `${planName} Tier`}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <p className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{plan.cadence}
                </span>
              </p>
            </div>

            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {plan.features.map((feature) => (
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
              {/* Upgrade Plan and Manage Plan open the same plan switcher */}
              <Sheet open={manageOpen} onOpenChange={setManageOpen}>
                <SheetTrigger render={<Button className="h-10 px-5" />}>
                  Upgrade Plan
                </SheetTrigger>
                <SheetTrigger
                  render={<Button variant="outline" className="h-10 px-5" />}
                >
                  Manage Plan
                </SheetTrigger>

                <SheetContent className="gap-0 sm:max-w-md">
                  <SheetHeader className="border-b border-border/60">
                    <SheetTitle>Manage Plan</SheetTitle>
                    <SheetDescription>
                      Switch between tiers. Changes apply at the next billing
                      cycle.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                    {(Object.keys(PLANS) as PlanName[]).map((tier) => {
                      const tierPlan = PLANS[tier]
                      const current = tier === planName
                      return (
                        <div
                          key={tier}
                          className={`rounded-xl border p-4 ${
                            current
                              ? "border-primary/50 bg-primary/10"
                              : "border-border/60 bg-card"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-foreground">
                              {tier}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">
                                {tierPlan.price}
                              </span>{" "}
                              /{tierPlan.cadence}
                            </p>
                          </div>
                          <ul className="mt-3 grid gap-1.5">
                            {TIER_LISTS[tier].map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <CheckIcon className="size-3 shrink-0 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {current ? (
                            <Button
                              variant="outline"
                              disabled
                              className="mt-4 w-full"
                            >
                              Current plan
                            </Button>
                          ) : pendingDowngrade && tier === "Free" ? (
                            <div className="mt-4 grid gap-2">
                              <p className="text-xs text-amber-400">
                                Downgrading removes Premium insights at the end
                                of the current cycle.
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setPendingDowngrade(false)}
                                >
                                  Keep {planName}
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => switchPlan("Free")}
                                >
                                  Confirm Downgrade
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant={tier === "Free" ? "outline" : "default"}
                              className="mt-4 w-full"
                              onClick={() =>
                                tier === "Free"
                                  ? setPendingDowngrade(true)
                                  : switchPlan(tier)
                              }
                            >
                              {tier === "Free"
                                ? "Downgrade to Free"
                                : `Switch to ${tier}`}
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <SheetFooter className="border-t border-border/60">
                    <SheetClose render={<Button variant="ghost" />}>
                      Close
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <span className="text-xs text-muted-foreground">
                {isPaid
                  ? "Next billing date: Oct 24, 2023"
                  : "No recurring charges on the Free plan"}
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
                onClick={exportCsv}
                className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
              >
                Export CSV
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
                {method.brand} ·• ·• ·• ·• {method.last4}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs">
                <span className="grid gap-0.5">
                  <span className="text-primary-foreground/60 uppercase">
                    Card Holder
                  </span>
                  {method.holder}
                </span>
                <span className="grid gap-0.5">
                  <span className="text-primary-foreground/60 uppercase">
                    Expires
                  </span>
                  {method.expiry}
                </span>
              </div>
            </div>

            {/* Add New Payment Method opens a validated card form */}
            <Sheet open={paymentOpen} onOpenChange={setPaymentOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className="mt-4 h-10 w-full gap-2"
                  />
                }
              >
                <CreditCardIcon className="size-4" />
                Add New Payment Method
              </SheetTrigger>

              <SheetContent className="gap-0 sm:max-w-sm">
                <SheetHeader className="border-b border-border/60">
                  <SheetTitle>Add Payment Method</SheetTitle>
                  <SheetDescription>
                    Your card is processed securely by Stripe.
                  </SheetDescription>
                </SheetHeader>

                {/* TODO: tokenize with Stripe Elements — persist only the
                    last4 + expiry via the billing API. */}
                <PaymentMethodForm
                  key={String(paymentOpen)}
                  onSave={(next) => {
                    setMethod(next)
                    setPaymentOpen(false)
                  }}
                />
              </SheetContent>
            </Sheet>
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
              <a
                href="mailto:support@hireloop.app"
                className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Contact Support
              </a>
              {/* Read Refund Policy opens the policy in a side sheet */}
              <Sheet open={refundOpen} onOpenChange={setRefundOpen}>
                <SheetTrigger
                  render={
                    <button
                      type="button"
                      className="text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
                    />
                  }
                >
                  Read Refund Policy
                </SheetTrigger>

                <SheetContent className="gap-0 sm:max-w-sm">
                  <SheetHeader className="border-b border-border/60">
                    <SheetTitle>Refund Policy</SheetTitle>
                    <SheetDescription>
                      HireLoop subscriptions and refunds, in short.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        14-day guarantee.
                      </span>{" "}
                      New subscriptions can be refunded in full within 14 days
                      of the first charge — no questions asked.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Renewals.
                      </span>{" "}
                      Recurring charges are non-refundable once the billing
                      cycle starts, but you can downgrade or cancel anytime
                      from Manage Plan; access continues until the period ends.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Enterprise.
                      </span>{" "}
                      Enterprise agreements follow the terms signed with your
                      account manager. Contact support to review your contract.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Failed charges.
                      </span>{" "}
                      If a payment fails we retry twice over 7 days before
                      pausing your subscription — no service interruption
                      during retries.
                    </p>
                  </div>

                  <SheetFooter className="border-t border-border/60">
                    <SheetClose render={<Button className="w-full" />}>
                      Got it
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// Card form rendered inside the payment-method sheet. Remounted on open
// (keyed by `paymentOpen`) so fields start empty every time.
const PaymentMethodForm = ({
  onSave,
}: {
  onSave: (method: PaymentMethod) => void
}) => {
  const [holder, setHolder] = React.useState("")
  const [number, setNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const submit = () => {
    const digits = number.replace(/\D/g, "")
    const nextErrors: Record<string, string> = {}
    if (!holder.trim()) nextErrors.holder = "Cardholder name is required"
    if (digits.length !== 16) nextErrors.number = "Enter the 16-digit card number"
    const expDigits = expiry.replace(/\D/g, "")
    if (expDigits.length !== 4 || Number(expDigits.slice(0, 2)) > 12 || Number(expDigits.slice(0, 2)) < 1) {
      nextErrors.expiry = "Use MM/YY"
    }
    if (!/^\d{3,4}$/.test(cvc)) nextErrors.cvc = "3–4 digits"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      brand: digits.startsWith("4") ? "VISA" : "MASTERCARD",
      last4: digits.slice(-4),
      holder: holder.trim(),
      expiry,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div className="grid gap-1.5">
        <Label htmlFor="card-holder">Cardholder name</Label>
        <Input
          id="card-holder"
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          placeholder="Alexander Seeker"
          aria-invalid={Boolean(errors.holder)}
        />
        {errors.holder ? (
          <p className="text-xs text-red-400">{errors.holder}</p>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="card-number">Card number</Label>
        <Input
          id="card-number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={number}
          onChange={(event) => setNumber(formatCardNumber(event.target.value))}
          placeholder="4242 4242 4242 4242"
          aria-invalid={Boolean(errors.number)}
        />
        {errors.number ? (
          <p className="text-xs text-red-400">{errors.number}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="card-expiry">Expiry</Label>
          <Input
            id="card-expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={expiry}
            onChange={(event) => setExpiry(formatExpiry(event.target.value))}
            placeholder="MM/YY"
            aria-invalid={Boolean(errors.expiry)}
          />
          {errors.expiry ? (
            <p className="text-xs text-red-400">{errors.expiry}</p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="card-cvc">CVC</Label>
          <Input
            id="card-cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={cvc}
            onChange={(event) =>
              setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="123"
            aria-invalid={Boolean(errors.cvc)}
          />
          {errors.cvc ? (
            <p className="text-xs text-red-400">{errors.cvc}</p>
          ) : null}
        </div>
      </div>

      <Button className="mt-auto h-10" onClick={submit}>
        Save Card
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Demo only — card details stay in your browser.
      </p>
    </div>
  )
}

export default SeekerBillingPage
