import * as React from "react"

import { cn } from "@/lib/utils"

type ChipGroupProps<T extends string> = {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  ariaLabel?: string
  className?: string
  /** Extra classes for each option button (e.g. "size-10 rounded-lg" for currency). */
  optionClassName?: string
}

/** A row of selectable chips (single-select) used in the job forms. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
  optionClassName,
}: ChipGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            value === option
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground",
            optionClassName
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
