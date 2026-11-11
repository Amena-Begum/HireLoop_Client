"use client"

import * as React from "react"
import Link from "next/link"
import {
  BuildingIcon,
  CheckIcon,
  GlobeIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"

import { Input } from "@/components/ui/input"

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const
const INDUSTRIES = [
  "AI / Cloud",
  "Fintech",
  "SaaS",
  "DevOps",
  "Design / Media",
  "E-commerce",
] as const

const INITIAL = {
  name: "",
  tagline: "",
  industry: "SaaS",
  size: "51–200",
  location: "",
  website: "",
  about: "",
}

function MyCompanyPage() {
  const [form, setForm] = React.useState(INITIAL)
  const [error, setError] = React.useState("")
  const [saved, setSaved] = React.useState(false)

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!form.name.trim()) {
      setError("Company name is required.")
      return
    }
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website.trim())) {
      setError("Website must be a full URL, e.g. https://techflow.com")
      return
    }

    // TODO: persist to your company API route when the backend is ready.
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Company</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your company profile is what job seekers see on every post.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="grid gap-6 xl:grid-cols-3">
        {/* Left column: company details */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          {/* Company identity */}
          <section className="rounded-xl border border-border/60 bg-card">
            <div className="border-b border-border/60 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Company details
              </h2>
            </div>
            <div className="flex flex-col gap-5 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-14 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"
                >
                  <BuildingIcon className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Company logo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Shown on your job posts and the public companies page.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor="company-name"
                    className="text-sm text-foreground/90"
                  >
                    Company name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="company-name"
                    value={form.name}
                    onChange={(event) => setField("name", event.target.value)}
                    placeholder="TechFlow"
                    className="h-10 bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="company-location"
                    className="text-sm text-foreground/90"
                  >
                    Headquarters
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company-location"
                      value={form.location}
                      onChange={(event) =>
                        setField("location", event.target.value)
                      }
                      placeholder="London, UK"
                      className="h-10 bg-background pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="company-tagline"
                  className="text-sm text-foreground/90"
                >
                  Tagline
                </label>
                <Input
                  id="company-tagline"
                  value={form.tagline}
                  onChange={(event) => setField("tagline", event.target.value)}
                  placeholder="Payment automation for a faster checkout."
                  className="h-10 bg-background"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="company-website"
                  className="text-sm text-foreground/90"
                >
                  Website
                </label>
                <div className="relative">
                  <GlobeIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company-website"
                    value={form.website}
                    onChange={(event) =>
                      setField("website", event.target.value)
                    }
                    placeholder="https://techflow.com"
                    className="h-10 bg-background pl-9"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="rounded-xl border border-border/60 bg-card">
            <div className="border-b border-border/60 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Classification
              </h2>
            </div>
            <div className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-2">
                <span className="text-sm text-foreground/90">Industry</span>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      aria-pressed={form.industry === industry}
                      onClick={() => setField("industry", industry)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        form.industry === industry
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm text-foreground/90">Company size</span>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={form.size === size}
                      onClick={() => setField("size", size)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        form.size === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="rounded-xl border border-border/60 bg-card">
            <div className="border-b border-border/60 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">About</h2>
            </div>
            <div className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-2">
                <textarea
                  aria-label="About your company"
                  value={form.about}
                  onChange={(event) => setField("about", event.target.value)}
                  rows={5}
                  placeholder="What you build, who you serve, and why great people should join you..."
                  className="w-full resize-none rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right column: preview + actions */}
        <div className="flex flex-col gap-6">
          {/* Public preview */}
          <section className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">
              Public preview
            </h2>
            <div className="mt-4 rounded-lg bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"
                >
                  <BuildingIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {form.name || "Your company name"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {form.industry}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {form.tagline || "Your tagline appears here."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                  <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                  {form.location || "Location"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                  <UsersIcon className="size-3.5 shrink-0 text-primary" />
                  {form.size} employees
                </span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Update Company
            </button>
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-medium text-red-400"
              >
                {error}
              </p>
            )}
            {saved && (
              <p
                role="status"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-400"
              >
                <CheckIcon className="size-3.5" />
                Company profile saved.
              </p>
            )}
          </div>

          {/* Related links */}
          <section className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">
              Your job posts
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Posts show your company details automatically.
            </p>
            <Link
              href="/dashboard/recruiter/jobs"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-soft underline-offset-4 hover:underline"
            >
              Manage jobs
            </Link>
          </section>
        </div>
      </form>
    </div>
  )
}

export default MyCompanyPage
