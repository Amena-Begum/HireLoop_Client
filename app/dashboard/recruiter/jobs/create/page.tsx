"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeftIcon, BriefcaseBusinessIcon, CheckIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { ChipGroup } from "@/components/ui/chip"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  CURRENCIES,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  type Currency,
  type EmploymentType,
  type WorkMode,
} from "@/lib/constants"

type FormState = {
  title: string
  company: string
  description: string
  location: string
  workMode: WorkMode
  employmentType: EmploymentType
  currency: Currency
  salaryMin: string
  salaryMax: string
  skills: string
}

const INITIAL_FORM: FormState = {
  title: "",
  company: "",
  description: "",
  location: "",
  workMode: "Hybrid",
  employmentType: "Full-time",
  currency: "$",
  salaryMin: "",
  salaryMax: "",
  skills: "",
}

function CreateJobPostPage() {
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM)
  const [error, setError] = React.useState("")
  const [posted, setPosted] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [jobRef, setJobRef] = React.useState("")

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
      setError("Job description is required.")
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
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = (await response.json().catch(() => null)) as
        | { job?: { ref: string }; message?: string }
        | null

      if (!response.ok || !data?.job) {
        toast.error(
          data?.message ??
            "Something went wrong while posting the job. Try again."
        )
        return
      }

      setJobRef(data.job.ref)
      setPosted(true)
      toast.success("Job post created")
    } catch {
      toast.error("Network error — check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Manage Jobs
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Create Job Post
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach over 50,000 active job seekers on HireLoop.
          </p>
        </div>
      </div>

      {posted ? (
        <EmptyState
          icon={CheckIcon}
          title="Job post created"
          iconClassName="bg-emerald-500/15 text-emerald-400"
          message={
            <>
              &ldquo;{form.title.trim()}&rdquo; is live and visible to job
              seekers
              {jobRef ? <> as <span className="font-mono text-xs text-foreground">{jobRef}</span></> : null}
              . Applications will appear in your dashboard.
            </>
          }
        >
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/recruiter"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Go to dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setForm(INITIAL_FORM)
                setPosted(false)
              }}
              className="inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Post another job
            </button>
          </div>
        </EmptyState>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Job details */}
          <section className="rounded-xl border border-border/60 bg-card">
            <div className="flex items-center gap-2 border-b border-border/60 p-5 sm:p-6">
              <BriefcaseBusinessIcon className="size-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Job details
              </h2>
            </div>
            <div className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor="job-title"
                    className="text-sm text-foreground/90"
                  >
                    Job title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="job-title"
                    value={form.title}
                    onChange={(event) => setField("title", event.target.value)}
                    placeholder="Senior Product Designer"
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
                    onChange={(event) =>
                      setField("company", event.target.value)
                    }
                    placeholder="TechFlow"
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
                  onChange={(event) =>
                    setField("description", event.target.value)
                  }
                  rows={5}
                  placeholder="What the person will do, the team they'll join, and what success looks like..."
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
                    onChange={(event) =>
                      setField("location", event.target.value)
                    }
                    placeholder="London, UK"
                    className="h-10 bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-foreground/90">
                    Work mode
                  </span>
                  <ChipGroup
                    options={WORK_MODES}
                    value={form.workMode}
                    onChange={(mode) => setField("workMode", mode)}
                    ariaLabel="Work mode"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm text-foreground/90">
                  Employment type
                </span>
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
                    onChange={(event) =>
                      setField("salaryMin", event.target.value)
                    }
                    placeholder="140000"
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
                    onChange={(event) =>
                      setField("salaryMax", event.target.value)
                    }
                    placeholder="180000"
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
                <label
                  htmlFor="job-skills"
                  className="text-sm text-foreground/90"
                >
                  Skills
                </label>
                <Input
                  id="job-skills"
                  value={form.skills}
                  onChange={(event) => setField("skills", event.target.value)}
                  placeholder="Figma, Design Systems, Prototyping"
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
            <Link
              href="/dashboard/recruiter/jobs"
              className="inline-flex h-11 items-center rounded-lg border border-border/60 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-60"
            >
              {saving ? "Posting…" : "Post Job"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateJobPostPage
