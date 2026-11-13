import * as React from "react"

import { cn } from "@/lib/utils"

type StatCardProps = {
  /** Optional icon; omit for value-first cards. */
  icon?: React.ComponentType<{ className?: string }>
  value: string
  label: string
  /** Optional second line under the label (e.g. "avg. view rate"). */
  hint?: string
  /** Override the default primary icon tone, e.g. "bg-amber-500/15 text-amber-400". */
  iconClassName?: string
  /** Optional trend badge (e.g. "+14%") shown next to the icon. */
  trend?: string
}

/** One stat tile (icon + big number + label) used across dashboards. */
export function StatCard({
  icon: Icon,
  value,
  label,
  hint,
  iconClassName,
  trend,
}: StatCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5">
      {Icon && (
        <div className="flex items-center justify-between gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-9 place-items-center rounded-lg",
              iconClassName ?? "bg-primary/15 text-primary"
            )}
          >
            <Icon className="size-4" />
          </span>
          {trend && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
              {trend}
            </span>
          )}
        </div>
      )}
      <span className="text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
        {value}
      </span>
      {hint ? (
        <span className="grid">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-xs text-muted-foreground/70">{hint}</span>
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </li>
  )
}

/** Grid wrapper for StatCards (2-up on mobile, 4-up on wide screens). */
export function StatGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 xl:grid-cols-4", className)}>
      {children}
    </ul>
  )
}
