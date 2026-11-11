import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  Building2Icon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Explore the hiring companies on HireLoop — vetted teams, real openings, verified reviews from real employees.",
}

const companies = [
  {
    id: 1,
    name: "CloudScale AI",
    tagline: "Infrastructure monitoring for modern engineering teams.",
    industry: "AI / Cloud",
    location: "New York, USA",
    size: "200–500 employees",
    openRoles: 12,
    accent: "bg-primary/15 text-primary",
  },
  {
    id: 2,
    name: "FinGrid",
    tagline: "The fintech dashboard trusted by 40k+ daily users.",
    industry: "Fintech",
    location: "Remote · Europe",
    size: "50–200 employees",
    openRoles: 8,
    accent: "bg-emerald-500/15 text-emerald-400",
  },
  {
    id: 3,
    name: "TechFlow",
    tagline: "Payment automation for a faster checkout.",
    industry: "SaaS",
    location: "London, UK",
    size: "200–500 employees",
    openRoles: 6,
    accent: "bg-fuchsia-500/15 text-fuchsia-400",
  },
  {
    id: 4,
    name: "CloudOps",
    tagline: "Globally distributed reliability, engineered in Berlin.",
    industry: "DevOps",
    location: "Berlin, Germany",
    size: "500–1,000 employees",
    openRoles: 14,
    accent: "bg-amber-500/15 text-amber-400",
  },
  {
    id: 5,
    name: "Creative Studio",
    tagline: "Design-driven products for creative professionals.",
    industry: "Design / Media",
    location: "Amsterdam, NL",
    size: "50–200 employees",
    openRoles: 4,
    accent: "bg-sky-500/15 text-sky-400",
  },
  {
    id: 6,
    name: "Wayne Enterprises",
    tagline: "A century of innovation, hiring its next chapter.",
    industry: "Conglomerate",
    location: "Manhattan, USA",
    size: "1,000+ employees",
    openRoles: 9,
    accent: "bg-foreground/10 text-foreground",
  },
] as const

const CompaniesPage = () => {
  return (
    <main className="min-h-svh py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Page header */}
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Companies
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Teams that are hiring on HireLoop
          </h1>
          <p className="mt-3 text-muted-foreground">
            Vetted companies, verified openings, and salary ranges published up
            front.
          </p>
        </div>

        {/* Companies grid */}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <li key={company.id}>
              <article className="flex h-full flex-col gap-5 rounded-xl bg-card p-6 transition-colors hover:bg-card/90">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`grid size-11 shrink-0 place-items-center rounded-lg ${company.accent}`}
                  >
                    <Building2Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold tracking-tight text-foreground">
                      {company.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {company.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                    {company.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <UsersIcon className="size-3.5 shrink-0 text-primary" />
                    {company.size}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                    {company.openRoles} open roles
                  </span>
                  <Link
                    href={`/jobs?q=${encodeURIComponent(company.name)}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-soft"
                  >
                    View jobs
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default CompaniesPage
