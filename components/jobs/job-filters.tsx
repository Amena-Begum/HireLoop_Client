"use client"

// Interactive pieces of the Browse Jobs page. Both components read the
// current filter values as props (parsed on the server) and update the URL
// search params, so the page itself stays a server component and remains
// shareable/bookmarkable at any filter combination.

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckIcon, MapPinIcon, SearchIcon } from "lucide-react"

import {
  FILTER_OPTIONS,
  hasActiveFilters,
  type JobFilterValues,
} from "@/lib/job-filters"
import { cn } from "@/lib/utils"

/** Sets a param when the value is non-empty, removes it otherwise. */
function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value)
  } else {
    params.delete(key)
  }
}

/** Merges a filter patch into the given URL params. */
function mergePatch(
  params: URLSearchParams,
  patch: Partial<JobFilterValues>
): URLSearchParams {
  const next = new URLSearchParams(params)
  if (patch.q !== undefined) setOrDelete(next, "q", patch.q)
  if (patch.modes) setOrDelete(next, "mode", patch.modes.join(","))
  if (patch.types) setOrDelete(next, "type", patch.types.join(","))
  if (patch.location !== undefined) setOrDelete(next, "location", patch.location)
  if (patch.minSalary !== undefined) {
    setOrDelete(next, "salary", patch.minSalary ? String(patch.minSalary) : "")
  }
  return next
}

/**
 * Returns a callback that patches one filter into the current /jobs URL.
 * Reads the live URL params (not the last render's props), so clicking two
 * filters in quick succession can't overwrite each other.
 */
function useFilterNav() {
  const router = useRouter()
  const searchParams = useSearchParams()
  return (patch: Partial<JobFilterValues>) => {
    const query = mergePatch(searchParams, patch).toString()
    router.push(query ? `/jobs?${query}` : "/jobs", { scroll: false })
  }
}

/** Keyword search bar shown above the jobs grid. */
export function JobSearch({ values }: { values: JobFilterValues }) {
  const apply = useFilterNav(values)
  const [q, setQ] = useState(values.q)

  // Re-sync when navigation happens elsewhere (e.g. "Clear all" in sidebar).
  useEffect(() => setQ(values.q), [values.q])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        apply({ q: q.trim() })
      }}
      className="mt-8 max-w-xl"
    >
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          aria-label="Search jobs"
          placeholder="Search jobs, companies, or skills..."
          value={q}
          onChange={(event) => setQ(event.target.value)}
          className="h-12 w-full rounded-full border border-border/60 bg-card pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
        />
      </div>
    </form>
  )
}

/** One selectable row (checkbox look) inside a filter group. */
function FilterRow({
  label,
  active,
  onToggle,
}: {
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-[4px] border transition-colors",
          active ? "border-primary bg-primary text-primary-foreground" : "border-input"
        )}
      >
        {active ? <CheckIcon className="size-3" /> : null}
      </span>
      {label}
    </button>
  )
}

type FilterItem = { id: string; label: string }

/** A titled group of selectable rows. */
function FilterGroup({
  title,
  items,
  selectedIds,
  onToggle,
}: {
  title: string
  items: readonly FilterItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <h3 className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-0.5">
        {items.map((item) => (
          <FilterRow
            key={item.id}
            label={item.label}
            active={selectedIds.includes(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

/** Sticky filter sidebar: location, work mode, job type, and salary. */
export function JobFilterSidebar({ values }: { values: JobFilterValues }) {
  const apply = useFilterNav(values)
  const [location, setLocation] = useState(values.location)

  useEffect(() => setLocation(values.location), [values.location])

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((value) => value !== item) : [...list, item]

  return (
    <aside className="flex flex-col gap-6 rounded-xl border border-border/60 bg-card p-5 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        {hasActiveFilters(values) ? (
          <Link
            href="/jobs"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      {/* Location — commit on Enter */}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          apply({ location: location.trim() })
        }}
        className="relative"
      >
        <MapPinIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          aria-label="Filter by location"
          placeholder="Location — press Enter"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
        />
      </form>

      <FilterGroup
        title="Work Mode"
        items={FILTER_OPTIONS.modes.map((mode) => ({ id: mode, label: mode }))}
        selectedIds={values.modes}
        onToggle={(id) => apply({ modes: toggleItem(values.modes, id) })}
      />

      <FilterGroup
        title="Job Type"
        items={FILTER_OPTIONS.types.map((type) => ({ id: type, label: type }))}
        selectedIds={values.types}
        onToggle={(id) => apply({ types: toggleItem(values.types, id) })}
      />

      <FilterGroup
        title="Salary"
        items={FILTER_OPTIONS.salaries.map((option) => ({
          id: String(option.value),
          label: option.label,
        }))}
        selectedIds={values.minSalary ? [String(values.minSalary)] : []}
        onToggle={(id) =>
          apply({
            minSalary: values.minSalary === Number(id) ? null : Number(id),
          })
        }
      />
    </aside>
  )
}
