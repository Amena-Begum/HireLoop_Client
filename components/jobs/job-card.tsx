// Reusable job card for public, marketing-side job lists (browse jobs).
// Renders a JobDoc (lib/types.ts) with the same visual language as the rest
// of the marketing pages. Dashboard cards that need Apply/Save buttons keep
// their own markup — pass children to add actions under the card instead.

import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CalendarIcon,
  EuroIcon,
  MapPinIcon,
} from "lucide-react"

import type { JobDoc } from "@/lib/types"

/** "€100,000 – €150,000" style label from the salary fields, or null. */
function salaryLabel(job: Pick<JobDoc, "currency" | "salaryMin" | "salaryMax">) {
  if (!job.salaryMin && !job.salaryMax) return null
  const fmt = (n: number) => `${job.currency}${n.toLocaleString()}`
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`
  return job.salaryMin ? `${fmt(job.salaryMin)}+` : `up to ${fmt(job.salaryMax as number)}`
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })

export function JobCard({ job }: { job: JobDoc }) {
  const salary = salaryLabel(job)

  return (
    <article className="flex h-full flex-col gap-5 rounded-xl bg-card p-6 transition-colors hover:bg-card/90">
      <div className="grid content-start gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {job.title}
          </h2>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {job.ref}
          </span>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-brand-soft">
          {job.company || "Confidential"}
        </p>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
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
        {salary ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
            <EuroIcon className="size-3.5 shrink-0 text-primary" />
            {salary}
          </span>
        ) : null}
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {job.employmentType}
        </span>
      </div>

      {job.skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <span
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          title={dateFormat.format(job.postedAt)}
        >
          <CalendarIcon className="size-3.5" />
          {dateFormat.format(job.postedAt)}
        </span>
        <Link
          href={`/sign-up?apply=${job.ref}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-soft"
        >
          Apply Now
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
