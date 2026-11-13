"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Loader2Icon,
  ShieldAlertIcon,
  ShieldXIcon,
  UserRoundIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"

type Role = "seeker" | "recruiter" | "admin"

const ROLE_LABEL: Record<Role, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Administrator",
}

const DASHBOARD_HOME: Record<Role, string> = {
  seeker: "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
}

/** Role required by the current URL segment, or null outside role areas. */
function requiredRole(pathname: string): Role | null {
  if (pathname.startsWith("/dashboard/admin")) return "admin"
  if (pathname.startsWith("/dashboard/recruiter")) return "recruiter"
  if (pathname.startsWith("/dashboard/seeker")) return "seeker"
  return null
}

/** Maps the stored better-auth `user.role` to a dashboard role. */
function roleFromUser(role: string | undefined | null): Role | null {
  if (role === "recruiter") return "recruiter"
  if (role === "admin") return "admin"
  if (role === "job-seeker") return "seeker"
  return null
}

function DeniedScreen({
  icon: Icon,
  title,
  message,
  signedInAs,
  dashboardHome,
}: {
  icon: typeof ShieldAlertIcon
  title: string
  message: string
  signedInAs: string | null
  dashboardHome: string | null
}) {
  return (
    <div className="grid min-h-svh place-items-center bg-background p-6">
      <section className="flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-8 text-center">
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-red-500/15 text-red-400"
        >
          <Icon className="size-5" />
        </span>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
        {signedInAs ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <UserRoundIcon className="size-3.5" />
            Signed in as{" "}
            <span className="font-medium text-foreground">{signedInAs}</span>
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {dashboardHome ? (
            <Link
              href={dashboardHome}
              className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Go to my dashboard
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg border border-border/60 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  )
}

export function RoleGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  // Areas outside the role-specific dashboards (e.g. bare /dashboard) are open.
  const required = requiredRole(pathname)
  if (!required) return <>{children}</>

  // Wait for the session before deciding, so nobody sees a false "denied".
  if (isPending) {
    return (
      <div className="grid min-h-svh place-items-center text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" aria-label="Loading" />
      </div>
    )
  }

  const user = session?.user ?? null
  const userRole = user ? roleFromUser(user.role) : null

  // Not signed in at all — every role area requires an account.
  if (!user) {
    return (
      <DeniedScreen
        icon={ShieldAlertIcon}
        title="Sign in required"
        message={`This dashboard is for ${ROLE_LABEL[required]} accounts. Sign in with the matching role, or create an account.`}
        signedInAs={null}
        dashboardHome={null}
      />
    )
  }

  // Signed in, but with a different role than this dashboard allows.
  if (userRole !== required) {
    return (
      <DeniedScreen
        icon={ShieldXIcon}
        title="Access restricted"
        message={`Only ${ROLE_LABEL[required]} accounts can open this dashboard. You are signed in as a ${userRole ? ROLE_LABEL[userRole] : "Job Seeker"}.`}
        signedInAs={user.name || user.email}
        dashboardHome={userRole ? DASHBOARD_HOME[userRole] : null}
      />
    )
  }

  return <>{children}</>
}
