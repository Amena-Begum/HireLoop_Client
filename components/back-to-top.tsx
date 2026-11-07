"use client"

import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

function BackToTop() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-fit gap-1.5 text-muted-foreground hover:text-foreground"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Back to top
      <ArrowUpIcon className="size-3.5" />
    </Button>
  )
}

export { BackToTop }
