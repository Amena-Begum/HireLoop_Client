import type { Metadata } from "next"
import Link from "next/link"
import { BookmarkIcon, Clock3Icon } from "lucide-react"

export const metadata: Metadata = {
  title: "Saved Jobs",
  description: "Manage and track your bookmarked opportunities.",
}

const savedJobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "TechFlow",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k – $200k + Equity",
    saved: "Saved 2 hours ago",
    closes: "Closes in 3 days",
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote, Global",
    salary: "$140k – $180k",
    saved: "Saved yesterday",
    closes: null,
  },
  {
    id: 3,
    title: "Staff UX Researcher",
    company: "Linear",
    location: "New York, NY (On-site)",
    salary: "$180k – $220k",
    saved: "Saved 3 days ago",
    closes: "Draft started",
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "Meta",
    location: "Menlo Park, CA (Hybrid)",
    salary: "$150k – $210k + Bonus",
    saved: "Saved 5 days ago",
    closes: null,
  },
  {
    id: 5,
    title: "Design Systems Lead",
    company: "Spotify",
    location: "Remote, USA",
    salary: "$170k – $230k",
    saved: "Saved last week",
    closes: "Closed by employer",
  },
] as const

const categories = ["All Saved", "Design (8)", "Engineering (12)", "Product (4)"] as const

const SeekerSavedPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Saved Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and track your bookmarked opportunities.
        </p>
      </div>

      {/* Stats */}
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <li className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary"
          >
            <BookmarkIcon className="size-4" />
          </span>
          <span className="text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
            24
          </span>
          <span className="text-xs text-muted-foreground">Total Saved</span>
        </li>
        <li className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-amber-500/15 text-amber-400"
          >
            <Clock3Icon className="size-4" />
          </span>
          <span className="text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
            3
          </span>
          <span className="text-xs text-muted-foreground">Closing Soon</span>
        </li>
      </ul>

      {/* Category filters + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              aria-pressed={index === 0}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          Sort by:{" "}
          <span className="font-medium text-foreground">Recently Saved</span>
        </span>
      </div>

      {/* Saved jobs list */}
      <ul className="flex flex-col gap-4">
        {savedJobs.map((job) => {
          const closed = job.closes === "Closed by employer"
          return (
            <li
              key={job.id}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="grid min-w-0 gap-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {job.title}
                  </h2>
                  <span
                    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                      closed
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {job.closes ?? "Open"}
                  </span>
                </div>
                <p className="text-sm font-medium text-brand-soft">
                  {job.company}
                </p>
                <p className="text-sm text-muted-foreground">
                  {job.location} · {job.salary}
                </p>
                <p className="text-xs text-muted-foreground/70">{job.saved}</p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href="/dashboard/seeker/applications"
                  className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
                    closed
                      ? "pointer-events-none border border-border/60 text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/80"
                  }`}
                >
                  {closed ? "Closed" : "Apply Now"}
                </Link>
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Remove from List
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Load more */}
      <div className="flex justify-center">
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-full border border-border/60 bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Load More
        </button>
      </div>
    </div>
  )
}

export default SeekerSavedPage
