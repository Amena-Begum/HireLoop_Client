import type { Metadata } from "next"
import Link from "next/link"
import { EuroIcon, MapPinIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Find Jobs",
  description: "Discover jobs matched to your profile.",
}

const jobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "TechFlow",
    location: "San Francisco, CA",
    workMode: "Hybrid",
    salary: "$160k – $200k + Equity",
    posted: "2 hours ago",
    closes: "Closes in 3 days",
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote, Global",
    workMode: "Remote",
    salary: "$140k – $180k",
    posted: "Yesterday",
    closes: null,
  },
  {
    id: 3,
    title: "Staff UX Researcher",
    company: "Linear",
    location: "New York, NY",
    workMode: "On-site",
    salary: "$180k – $220k",
    posted: "3 days ago",
    closes: null,
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "Meta",
    location: "Menlo Park, CA",
    workMode: "Hybrid",
    salary: "$150k – $210k + Bonus",
    posted: "5 days ago",
    closes: null,
  },
  {
    id: 5,
    title: "Design Systems Lead",
    company: "Spotify",
    location: "Remote, USA",
    workMode: "Remote",
    salary: "$170k – $230k",
    posted: "6 days ago",
    closes: "Closed yesterday",
  },
] as const

const SeekerJobsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Find Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover roles matched to your profile and skills.
        </p>
      </div>

      {/* Jobs grid */}
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => {
          const closed = job.closes?.startsWith("Closed")
          return (
            <li key={job.id}>
              <article className="flex h-full flex-col gap-4 rounded-xl border border-border/60 bg-card p-6 transition-colors hover:bg-card/90">
                <div className="grid content-start gap-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      {job.title}
                    </h2>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {job.posted}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-brand-soft">
                    {job.company}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                    {job.location} ({job.workMode})
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <EuroIcon className="size-3.5 shrink-0 text-primary" />
                    {job.salary}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <span
                    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                      closed
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {job.closes ?? "Accepting applications"}
                  </span>
                  <Link
                    href="/dashboard/seeker/applications"
                    className={`inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
                      closed
                        ? "pointer-events-none border border-border/60 text-muted-foreground"
                        : "bg-primary text-primary-foreground hover:bg-primary/80"
                    }`}
                  >
                    {closed ? "Closed" : "Apply Now"}
                  </Link>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SeekerJobsPage
