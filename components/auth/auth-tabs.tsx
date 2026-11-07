"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "cn"

const authTabs = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
] as const

function AuthTabs() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Authentication"
      className="grid w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-muted/40 p-1"
    >
      {authTabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export { AuthTabs }
