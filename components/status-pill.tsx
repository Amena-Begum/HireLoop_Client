import { cn } from "@/lib/utils"

/**
 * Shared color tones for status pills across the app. Any unknown status
 * falls back to a neutral muted pill.
 */
const PILL_STYLES: Record<string, string> = {
  // Job statuses
  Active: "bg-emerald-500/15 text-emerald-400",
  Paused: "bg-amber-500/15 text-amber-400",
  Closed: "bg-muted text-muted-foreground",
  // Application statuses
  New: "bg-sky-500/15 text-sky-400",
  "Under Review": "bg-amber-500/15 text-amber-400",
  Shortlisted: "bg-emerald-500/15 text-emerald-400",
  Rejected: "bg-red-500/15 text-red-400",
  "Interview Scheduled": "bg-primary/15 text-primary",
  // User roles (admin user management)
  Seeker: "bg-sky-500/15 text-sky-400",
  Recruiter: "bg-primary/15 text-primary",
  Administrator: "bg-amber-500/15 text-amber-400",
  // Company plans
  Enterprise: "bg-primary/15 text-primary",
  Professional: "bg-sky-500/15 text-sky-400",
  Free: "bg-muted text-muted-foreground",
  // Company / payment statuses
  Verified: "bg-emerald-500/15 text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Suspended: "bg-red-500/15 text-red-400",
  Success: "bg-emerald-500/15 text-emerald-400",
  Failed: "bg-red-500/15 text-red-400",
}

type StatusPillProps = {
  status: string
  className?: string
}

/** A rounded status badge — colors resolve from the shared tone map. */
export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        PILL_STYLES[status] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </span>
  )
}
