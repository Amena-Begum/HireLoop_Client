import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon, SparklesIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for every stage of the job hunt — start free, upgrade when you want premium job insights. Recruiters can hire on any plan.",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description:
      "Everything you need to start applying and tracking your search.",
    features: [
      "Unlimited job browsing & alerts",
      "5 applications per month",
      "Basic profile & resume upload",
      "Application status tracking",
    ],
    cta: { label: "Get started free", href: "/sign-up", variant: "outline" },
    featured: false,
  },
  {
    name: "Professional",
    price: "$29",
    cadence: "per month",
    description:
      "For serious seekers who want to move first, not fastest-fingered.",
    features: [
      "Everything in Free",
      "Unlimited one-click applications",
      "Premium Job Insights & salary data",
      "Priority matching in recruiter search",
      "Interview preparedness resources",
    ],
    cta: { label: "Upgrade plan", href: "/sign-up?plan=pro", variant: "primary" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$1,299",
    cadence: "per month",
    description: "For hiring teams and talent agencies at scale.",
    features: [
      "Everything in Professional",
      "Unlimited job posts & seats",
      "Applicant pipeline & team notes",
      "API access & ATS integrations",
      "Dedicated account manager",
    ],
    cta: {
      label: "Talk to sales",
      href: "mailto:sales@hireloop.app",
      variant: "outline",
    },
    featured: false,
  },
] as const

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Anytime. Upgrades apply instantly, downgrades take effect at the end of your billing cycle.",
  },
  {
    q: "Do recruiters pay to post jobs?",
    a: "Posting is included in every recruiter account. Enterprise unlocks unlimited posts, seats, and API access.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — if Premium Job Insights don't help within 14 days, we refund the first month, no questions asked.",
  },
] as const

const PricingPage = () => {
  return (
    <main className="min-h-svh py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Page header */}
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Pricing
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pay for momentum, not promises
          </h1>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you want premium job insights. Every plan
            includes real openings from verified hiring teams.
          </p>
        </div>

        {/* Plans */}
        <ul className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-14 lg:grid-cols-3">
          {plans.map((plan) => (
            <li key={plan.name}>
              <article
                className={`relative flex h-full flex-col gap-6 rounded-xl p-6 sm:p-7 ${
                  plan.featured
                    ? "border border-primary/50 bg-primary/10"
                    : "border border-border/60 bg-card"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <SparklesIcon className="size-3" />
                    Most popular
                  </span>
                )}

                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.cadence}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="grid gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full ${
                          plan.featured
                            ? "bg-primary/25 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <CheckIcon className="size-3" />
                      </span>
                      <span className="text-sm text-foreground/90">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.cta.href}
                  className={`mt-auto inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors ${
                    plan.cta.variant === "primary"
                      ? "bg-primary text-primary-foreground hover:bg-primary/80"
                      : "border border-border/60 bg-transparent text-foreground hover:bg-muted"
                  }`}
                >
                  {plan.cta.label}
                </Link>
              </article>
            </li>
          ))}
        </ul>

        {/* FAQ */}
        <section className="mx-auto mt-16 max-w-3xl sm:mt-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <ul className="mt-8 grid gap-4">
            {faqs.map((faq) => (
              <li key={faq.q} className="rounded-xl bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground">
                  {faq.q}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default PricingPage
