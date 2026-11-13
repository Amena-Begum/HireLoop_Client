import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description: string
  /** Optional content rendered on the right (e.g. a "Create" button). */
  action?: React.ReactNode
  className?: string
}

/** The standard dashboard page header (title + description, optional action). */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        action && "sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

/** Action button rendered to the right of a page header. */
export function PageHeaderAction({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
    >
      {children}
    </Link>
  )
}
