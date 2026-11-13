
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PencilIcon, Trash2Icon } from "lucide-react"

type JobActionsProps = {
  jobRef: string
  title: string
}

export function JobActions({ jobRef, title }: JobActionsProps) {
  const router = useRouter()

  const [confirming, setConfirming] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  async function handleDelete() {
    if (deleting) return

    setDeleting(true)

    try {
      const response = await fetch(
        `/api/jobs/${encodeURIComponent(jobRef)}`,
        {
          method: "DELETE",
        }
      )

      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null

      if (!response.ok) {
        toast.error(data?.message ?? "Delete failed. Please try again.")
        return
      }

      // Close confirmation and refresh the server-rendered jobs table.
      setConfirming(false)
      toast.success(`Deleted job post ${jobRef}`)
      router.refresh()
    } catch {
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <span className="flex flex-col items-start gap-1">
      <span className="flex items-center gap-2">
        {/* Edit job */}
        <Link
          href={`/dashboard/recruiter/jobs/${encodeURIComponent(jobRef)}/edit`}
          aria-label={`Edit job post ${title}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <PencilIcon className="size-3.5" />
          Edit
        </Link>

        {/* Delete confirmation */}
        {confirming ? (
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2Icon className="size-3.5" />
              {deleting ? "Deleting…" : "Confirm"}
            </button>

            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="rounded-lg border border-border/60 bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            aria-label={`Delete job post ${title}`}
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <Trash2Icon className="size-3.5" />
            Delete
          </button>
        )}
      </span>
    </span>
  )
}
