// Pure helpers for the public Browse Jobs page: URL search-param parsing and
// in-memory job filtering. Kept free of React/MongoDB so it is trivial to
// read and test. Filter fields mirror the common fields of the job form
// (title, company, description, skills, workMode, employmentType, location,
// salary) — see lib/types.ts and lib/constants.ts.

import { EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/constants"

export type JobFilterValues = {
  /** Keyword searched across title, company, description, and skills. */
  q: string
  /** Selected work modes, e.g. ["Remote", "Hybrid"]. */
  modes: string[]
  /** Selected employment types, e.g. ["Full-time"]. */
  types: string[]
  /** Free-text location substring, e.g. "Dhaka". */
  location: string
  /** Minimum salary buckets the job's top salary must reach. */
  minSalary: number | null
}

/** Salary buckets shown in the sidebar — the job pays at least this. */
export const SALARY_OPTIONS = [
  { label: "10,000+", value: 10000 },
  { label: "25,000+", value: 25000 },
  { label: "50,000+", value: 50000 },
  { label: "100,000+", value: 100000 },
] as const

/** Sidebar option lists, straight from the shared constants. */
export const FILTER_OPTIONS = {
  modes: WORK_MODES,
  types: EMPLOYMENT_TYPES,
  salaries: SALARY_OPTIONS,
} as const

const firstParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
): string => {
  const value = params[key]
  const raw = Array.isArray(value) ? value[0] : value
  return (raw ?? "").trim()
}

const listParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
): string[] =>
  firstParam(params, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

/** Reads the /jobs URL search params into a JobFilterValues object. */
export function parseJobFilters(
  params: Record<string, string | string[] | undefined>
): JobFilterValues {
  const salaryParam = Number(firstParam(params, "salary"))
  return {
    q: firstParam(params, "q"),
    modes: listParam(params, "mode").filter((mode) =>
      (WORK_MODES as readonly string[]).includes(mode)
    ),
    types: listParam(params, "type").filter((type) =>
      (EMPLOYMENT_TYPES as readonly string[]).includes(type)
    ),
    location: firstParam(params, "location"),
    minSalary: Number.isFinite(salaryParam) && salaryParam > 0 ? salaryParam : null,
  }
}

/** The fields any job-like object must expose to be filtered. */
export type FilterableJob = {
  title: string
  company: string
  description: string
  skills: string[]
  workMode: string
  employmentType: string
  location: string
  salaryMin: number | null
  salaryMax: number | null
}

/** Returns true when at least one filter is active (drives "Clear all"). */
export function hasActiveFilters(values: JobFilterValues): boolean {
  return Boolean(
    values.q ||
      values.modes.length > 0 ||
      values.types.length > 0 ||
      values.location ||
      values.minSalary
  )
}

/** Keeps only the jobs matching every active filter. */
export function applyJobFilters<T extends FilterableJob>(
  jobs: T[],
  values: JobFilterValues
): T[] {
  const q = values.q.toLowerCase()
  const location = values.location.toLowerCase()

  return jobs.filter((job) => {
    if (q) {
      const haystack =
        `${job.title} ${job.company} ${job.description} ${job.skills.join(" ")}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (values.modes.length > 0 && !values.modes.includes(job.workMode)) {
      return false
    }
    if (values.types.length > 0 && !values.types.includes(job.employmentType)) {
      return false
    }
    if (location && !job.location.toLowerCase().includes(location)) {
      return false
    }
    if (values.minSalary) {
      const topSalary = job.salaryMax ?? job.salaryMin ?? 0
      if (topSalary < values.minSalary) return false
    }
    return true
  })
}
