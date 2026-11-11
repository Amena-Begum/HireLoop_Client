import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  ClockIcon,
  EuroIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Browse every job opening on HireLoop — filter by location and work mode to find the right role for you.",
}

const jobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "CloudScale AI",
    description:
      "Design elegant interfaces for next-generation infrastructure monitoring tools used by thousands of engineering teams.",
    location: "New York, USA",
    workMode: "Hybrid",
    salary: "$140k – $180k",
    type: "Full-time",
    posted: "2 hours ago",
  },
  {
    id: 2,
    title: "Lead Frontend Engineer",
    company: "FinGrid",
    description:
      "Own the frontend architecture of a fintech dashboard used by 40k+ daily users. React, TypeScript, design systems.",
    location: "Remote · Europe",
    workMode: "Remote",
    salary: "$110k – $145k",
    type: "Full-time",
    posted: "5 hours ago",
  },
  {
    id: 3,
    title: "Product Designer",
    company: "TechFlow",
    description:
      "Shape the end-to-end product experience from research to high-fidelity prototyping alongside a senior design team.",
    location: "London, UK",
    workMode: "Hybrid",
    salary: "$165k – $210k",
    type: "Full-time",
    posted: "Yesterday",
  },
  {
    id: 4,
    title: "Staff Software Engineer",
    company: "CloudOps",
    description:
      "Lead backend reliability projects across a globally distributed platform. Go, Kubernetes, and a lot of enthusiasm.",
    location: "Berlin, Germany",
    workMode: "On-site",
    salary: "$180k – $250k",
    type: "Full-time",
    posted: "2 days ago",
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "Wayne Enterprises",
    description:
      "Build and polish customer-facing web features with a focus on accessibility and performance. React, Next.js, Tailwind.",
    location: "Manhattan, USA",
    workMode: "Hybrid",
    salary: "$95k – $130k",
    type: "Contract",
    posted: "3 days ago",
  },
  {
    id: 6,
    title: "Growth Marketing Lead",
    company: "Creative Studio",
    description:
      "Drive acquisition across paid and organic channels for a portfolio of creative SaaS products.",
    location: "Amsterdam, NL",
    workMode: "Hybrid",
    salary: "$85k – $115k",
    type: "Full-time",
    posted: "4 days ago",
  },
] as const

function JobCard({ job }: { job: (typeof jobs)[number] }) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-xl bg-card p-6 transition-colors hover:bg-card/90">
      <div className="grid content-start gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {job.title}
          </h2>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5" />
            {job.posted}
          </span>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-brand-soft">
          {job.company}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {job.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
          <MapPinIcon className="size-3.5 shrink-0 text-primary" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
          <BriefcaseBusinessIcon className="size-3.5 shrink-0 text-primary" />
          {job.workMode}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
          <EuroIcon className="size-3.5 shrink-0 text-primary" />
          {job.salary}
        </span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {job.type}
        </span>
      </div>

      <div className="mt-auto pt-1">
        <Link
          href={`/sign-up?apply=${job.id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-soft"
        >
          Apply Now
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

const JobsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) => {
  const params = (await searchParams) ?? {}
  const rawQ = params.q
  const query = (typeof rawQ === "string" ? rawQ : "").toLowerCase()

  const filtered = jobs.filter(
    (job) =>
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
  )

  return (
    <main className="min-h-svh py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Page header */}
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Browse Jobs
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {filtered.length} open role{filtered.length === 1 ? "" : "s"} from
            the teams that are hiring
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every posting comes straight from the hiring team — no ghost
            listings, no recruiter spam.
          </p>
        </div>

        {/* Search hint */}
        <form action="/jobs" className="mt-8 max-w-xl">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              aria-label="Search jobs"
              placeholder="Search jobs, companies, or skills..."
              defaultValue={query}
              className="h-12 w-full rounded-full border border-border/60 bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>
        </form>

        {/* Jobs grid */}
        {filtered.length === 0 ? (
          <p className="mt-14 rounded-xl bg-card p-8 text-center text-sm text-muted-foreground">
            No roles match your search right now — try a different keyword.
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 rounded-xl bg-card p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="hidden size-12 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary sm:grid"
            >
              <UsersIcon className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Can&apos;t find the right role?
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Build a profile in three minutes. The matches start arriving
                tomorrow morning.
              </p>
            </div>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create free account
          </Link>
        </div>
      </div>
    </main>
  )
}

export default JobsPage
