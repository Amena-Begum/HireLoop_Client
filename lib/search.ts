/** Escapes user input so it can't inject regex operators into a $regex filter. */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Builds a MongoDB filter matching the query against a job's text fields.
 * Callers add status/ownership constraints on top.
 */
export function buildJobSearchFilter(
  query: string,
  extraFields: string[] = []
): { $or: Array<Record<string, unknown>> } {
  const rx = { $regex: escapeRegex(query), $options: "i" }
  const or: Array<Record<string, unknown>> = [
    { title: rx },
    { company: rx },
    { location: rx },
    { description: rx },
  ]
  for (const field of extraFields) {
    or.push({ [field]: rx })
  }
  return { $or: or }
}
