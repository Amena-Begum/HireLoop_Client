"use client"

import * as React from "react"
import { toast } from "sonner"
import { BookmarkIcon } from "lucide-react"

type SaveButtonProps = {
  /** Human-facing job reference, e.g. "HL-90210" */
  jobRef: string
  /** Server-rendered initial state so the list matches the DB */
  saved: boolean
}

/** Bookmark toggle on the Find Jobs cards — persists to /api/saved-jobs. */
export function SaveButton({ jobRef, saved }: SaveButtonProps) {
  const [isSaved, setIsSaved] = React.useState(saved)
  const [busy, setBusy] = React.useState(false)

  async function toggle() {
    if (busy) return
    setBusy(true)
    const nextState = !isSaved
    try {
      const response = await fetch("/api/saved-jobs", {
        method: nextState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: jobRef }),
      })
      if (response.ok || response.status === 409) {
        // Created, already saved, or removed — trust the intended state.
        setIsSaved(nextState)
        toast.success(
          nextState ? "Saved to your list" : "Removed from your saved jobs"
        )
        return
      }
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null
      toast.error(data?.message ?? "Something went wrong. Try again.")
    } catch {
      toast.error("Network error — check your connection.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={isSaved}
      title={isSaved ? "Remove from saved jobs" : "Save this job"}
      className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
        isSaved
          ? "bg-primary/10 text-primary"
          : "border border-border/60 bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      <BookmarkIcon className={`size-4 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save"}
    </button>
  )
}
