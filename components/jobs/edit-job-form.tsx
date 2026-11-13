"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BriefcaseBusinessIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { ChipGroup } from "@/components/ui/chip"
import { toast } from "sonner"
import {
  CURRENCIES,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  WORK_MODES,
  type Currency,
  type EmploymentType,
  type JobStatus,
  type WorkMode,
} from "@/lib/constants"

export type EditableJob = {
  ref: string
  title: string
  company: string
  description: string
  location: string
  workMode: string
  employmentType: string
  currency: string
  salaryMin: number | null
  salaryMax: number | null
  skills: string[]
  status: string
}

type FormState = {
  title: string
  company: string
  description: string
  location: string
  workMode: WorkMode
  employmentType: EmploymentType
  currency: Currency
  status: JobStatus
  salaryMin: string
  salaryMax: string
  skills: string
}

function toFormState(job: EditableJob): FormState {
  return {
    title: job.title,
    company: job.company,
    description: job.description,
    location: job.location,
    workMode: (WORK_MODES as readonly string[]).includes(job.workMode)
      ? (job.workMode as FormState["workMode"])
      : "Hybrid",
    employmentType: (EMPLOYMENT_TYPES as readonly string[]).includes(
      job.employmentType
    )
      ? (job.employmentType as FormState["employmentType"])
      : "Full-time",
    currency: (CURRENCIES as readonly string[]).includes(job.currency)
      ? (job.currency as FormState["currency"])
      : "$",
    status: (JOB_STATUSES as readonly string[]).includes(job.status)
      ? (job.status as FormState["status"])
      : "Active",
    salaryMin: job.salaryMin === null ? "" : String(job.salaryMin),
    salaryMax: job.salaryMax === null ? "" : String(job.salaryMax),
    skills: job.skills.join(", "),
  }
}

export function EditJobForm({ job }: { job: EditableJob }) {
  const router = useRouter()
  const [form, setForm] = React.useState<FormState>(() => toFormState(job))
  const [error, setError] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!form.title.trim()) {
      setError("Job title is required.")
      return
    }
    if (!form.description.trim()) {
      setError("Description is required.")
      return
    }
    if (!form.location.trim()) {
      setError("Location is required.")
      return
    }
    const min = Number(form.salaryMin)
    const max = Number(form.salaryMax)
    if (form.salaryMin && Number.isNaN(min)) {
      setError("Minimum salary must be a number.")
      return
    }
    if (form.salaryMax && Number.isNaN(max)) {
      setError("Maximum salary must be a number.")
      return
    }
    if (form.salaryMin && form.salaryMax && max < min) {
      setError("Maximum salary can't be lower than the minimum.")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(
        `/api/jobs/${encodeURIComponent(job.ref)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )
      const data = (await response.json().catch(() => null)) as
        | { job?: unknown; message?: string }
        | null

      if (!response.ok || !data?.job) {
        toast.error(
          data?.message ?? "Something went wrong while saving. Try again."
        )
        return
      }

      toast.success("Job post updated")
      // The list table is server-rendered — refresh it to show the changes.
      router.refresh()
    } catch {
      toast.error("Network error — check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Status */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="flex items-center gap-2 border-b border-border/60 p-5 sm:p-6">
          <BriefcaseBusinessIcon className="size-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Job status
          </h2>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <ChipGroup
              options={JOB_STATUSES}
              value={form.status}
              onChange={(status) => setField("status", status)}
              ariaLabel="Job status"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Paused and Closed jobs stop accepting new applications.
          </p>
        </div>
      </section>

      {/* Job details */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground">
            Job details
          </h2>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="job-title" className="text-sm text-foreground/90">
                Job title <span className="text-red-400">*</span>
              </label>
              <Input
                id="job-title"
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className="h-10 bg-background"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="job-company"
                className="text-sm text-foreground/90"
              >
                Company name
              </label>
              <Input
                id="job-company"
                value={form.company}
                onChange={(event) => setField("company", event.target.value)}
                className="h-10 bg-background"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="job-description"
              className="text-sm text-foreground/90"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="job-description"
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              rows={5}
              className="w-full resize-none rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>
        </div>
      </section>

      {/* Compensation & location */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground">
            Compensation &amp; location
          </h2>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="job-location"
                className="text-sm text-foreground/90"
              >
                Location <span className="text-red-400">*</span>
              </label>
              <Input
                id="job-location"
                value={form.location}
                onChange={(event) => setField("location", event.target.value)}
                className="h-10 bg-background"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-foreground/90">Work mode</span>
              <ChipGroup
                options={WORK_MODES}
                value={form.workMode}
                onChange={(mode) => setField("workMode", mode)}
                ariaLabel="Work mode"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm text-foreground/90">Employment type</span>
            <ChipGroup
              options={EMPLOYMENT_TYPES}
              value={form.employmentType}
              onChange={(type) => setField("employmentType", type)}
              ariaLabel="Employment type"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-[auto_1fr_1fr]">
            <div className="grid gap-2">
              <span className="text-sm text-foreground/90">Currency</span>
              <ChipGroup
                options={CURRENCIES}
                value={form.currency}
                onChange={(currency) => setField("currency", currency)}
                ariaLabel="Currency"
                optionClassName="size-10 rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="salary-min"
                className="text-sm text-foreground/90"
              >
                Salary minimum (yearly)
              </label>
              <Input
                id="salary-min"
                inputMode="numeric"
                value={form.salaryMin}
                onChange={(event) => setField("salaryMin", event.target.value)}
                className="h-10 bg-background"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="salary-max"
                className="text-sm text-foreground/90"
              >
                Salary maximum (yearly)
              </label>
              <Input
                id="salary-max"
                inputMode="numeric"
                value={form.salaryMax}
                onChange={(event) => setField("salaryMax", event.target.value)}
                className="h-10 bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/60 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground">
            Requirements
          </h2>
        </div>
        <div className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-2">
            <label htmlFor="job-skills" className="text-sm text-foreground/90">
              Skills
            </label>
            <Input
              id="job-skills"
              value={form.skills}
              onChange={(event) => setField("skills", event.target.value)}
              className="h-10 bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Separate skills with commas — seekers are matched with these.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-400"
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/recruiter/jobs")}
          className="inline-flex h-11 items-center rounded-lg border border-border/60 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Back to jobs
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
