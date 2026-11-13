"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

type JobSearchProps = {
  placeholder: string
}

/**
 * Search box that keeps its value in the URL (?q=...) — the surrounding
 * server component re-renders with the filtered results. Debounced so
 * typing doesn't hammer the server.
 */
export function JobSearch({ placeholder }: JobSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = React.useState(searchParams.get("q") ?? "")
  const mounted = React.useRef(false)

  React.useEffect(() => {
    // Skip the initial mount — the URL already holds the right value.
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set("q", value.trim())
      } else {
        params.delete("q")
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, 300)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        aria-label="Search jobs"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-10 bg-background pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  )
}
