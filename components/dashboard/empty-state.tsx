import * as React from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  message: React.ReactNode
  /** Override the default primary icon tone, e.g. "bg-amber-500/15 text-amber-400". */
  iconClassName?: string
  /** Optional actions (links/buttons) shown under the message. */
  children?: React.ReactNode
  className?: string
}

/** The standard "nothing here yet" card used across dashboards. */
export function EmptyState({
  icon: Icon,
  title,
  message,
  iconClassName,
  children,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-10 text-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-full",
          iconClassName ?? "bg-primary/15 text-primary"
        )}
      >
        <Icon className="size-5" />
      </span>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {children}
    </section>
  )
}
