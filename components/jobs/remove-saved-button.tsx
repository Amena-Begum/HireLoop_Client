"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type RemoveSavedButtonProps = {
  /** Human-facing job reference, e.g. "HL-90210" */
  jobRef: string
}

/** "Remove from List" on the Saved Jobs page — deletes the bookmark and refreshes the server-rendered list. */
export function RemoveSavedButton({ jobRef }: RemoveSavedButtonProps) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)

  async function remove() {
    if (busy) return
    setBusy(true)
    try {
      const response = await fetch("/api/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: jobRef }),
      })
      if (response.ok) {
        // The list is server-rendered — re-run it without the removed job.
        router.refresh()
        toast.success("Removed from your saved jobs")
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
      onClick={remove}
      disabled={busy}
      className="inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
    >
      {busy ? "Removing…" : "Remove from List"}
    </button>
  )
}
