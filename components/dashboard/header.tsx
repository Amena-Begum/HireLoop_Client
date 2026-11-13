"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { BellIcon, SearchIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { UserAvatar } from "@/components/user-avatar"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

const SEARCH_PLACEHOLDER = {
  seeker: "Search for opportunities...",
  recruiter: "Search applications, jobs, or talent...",
  admin: "Global search...",
} as const

// Where each role's header search lands.
const SEARCH_TARGET = {
  seeker: "/dashboard/seeker/jobs",
  recruiter: "/dashboard/recruiter/jobs",
  admin: "/dashboard/admin/jobs",
} as const

type Role = keyof typeof SEARCH_PLACEHOLDER

function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const role: Role = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/recruiter")
      ? "recruiter"
      : "seeker"

  const user = session?.user ?? null

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = String(new FormData(event.currentTarget).get("search") ?? "").trim()
    const target = SEARCH_TARGET[role]
    router.push(q ? `${target}?q=${encodeURIComponent(q)}` : target)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:gap-4 sm:px-6 lg:px-8">
      <SidebarTrigger aria-label="Toggle sidebar" />
      <form onSubmit={handleSearch} className="relative min-w-0 flex-1 max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          aria-label="Search"
          placeholder={SEARCH_PLACEHOLDER[role]}
          className="h-10 bg-card/60 pl-9"
        />
      </form>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <BellIcon className="size-4" />
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 size-1.5 rounded-full bg-primary"
          />
        </button>

        {/* Signed-in user: name + profile image (or icon when no image) */}
        {user && (
          <span className="flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 py-1 pl-1 pr-3 sm:pr-4">
            <UserAvatar name={user.name} image={user.image} />
            {user.name && (
              <span
                className="max-w-[120px] truncate text-sm font-medium text-foreground/80"
                title={user.name}
              >
                {user.name}
              </span>
            )}
          </span>
        )}
      </div>
    </header>
  )
}

export { DashboardHeader }
