"use client"

import * as React from "react"
import { toast } from "sonner"

import { CheckIcon } from "lucide-react"

type ApplyButtonProps = {
  /** Human-facing job reference, e.g. "HL-90210" */
  jobRef: string
  /** Server-rendered initial state so the list matches the DB */
  applied: boolean
  closed: boolean
}

export function ApplyButton({ jobRef, applied, closed }: ApplyButtonProps) {
  const [state, setState] = React.useState<"idle" | "applied" | "busy">(
    applied ? "applied" : "idle"
  )

  async function apply() {
    setState("busy")
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: jobRef }),
      })
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null

      if (response.status === 201 || response.status === 409) {
        // Created, or already applied — either way the seeker is applied.
        setState("applied")
        toast.success("Application submitted")
        return
      }
      toast.error(data?.message ?? "Something went wrong. Try again.")
      setState("idle")
    } catch {
      toast.error("Network error — check your connection.")
      setState("idle")
    }
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={apply}
        disabled={state !== "idle" || closed}
        className={`inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors ${
          closed
            ? "pointer-events-none border border-border/60 text-muted-foreground"
            : state === "applied"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-60"
        }`}
      >
        {closed ? (
          "Closed"
        ) : state === "applied" ? (
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-4" />
            Applied
          </span>
        ) : state === "busy" ? (
          "Applying…"
        ) : (
          "Apply Now"
        )}
      </button>
    </span>
  )
}
