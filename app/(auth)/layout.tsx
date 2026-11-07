import type { ReactNode } from "react"
import { HandshakeIcon, LineChartIcon, ShieldCheckIcon } from "lucide-react"

import { AuthTabs } from "@/components/auth/auth-tabs"

const highlights = [
  {
    icon: ShieldCheckIcon,
    title: "Verified employers",
    description: "Every posting is screened so you never apply into the void.",
  },
  {
    icon: LineChartIcon,
    title: "Smarter matching",
    description: "Roles surface based on your skills, not just your keywords.",
  },
  {
    icon: HandshakeIcon,
    title: "End-to-end hiring",
    description: "Track applications, interviews and offers in one loop.",
  },
] as const

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-320px] size-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute bottom-[-240px] right-[-160px] size-[480px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:gap-16 lg:py-20">
        {/* Promo panel */}
        <section aria-hidden="true" className="hidden lg:block">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
            HireLoop
          </span>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight xl:text-5xl">
            Everything you need to land the role.
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            Where job seekers and recruiters find each other faster — 50,000+ active
            roles and counting.
          </p>

          <ul className="mt-8 max-w-md space-y-4">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <item.icon className="size-4" />
                </span>
                <span className="grid gap-0.5">
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                </span>
              </li>
            ))}
          </ul>

          <figure className="mt-10 max-w-md rounded-xl border border-border/60 bg-card/50 p-5">
            <blockquote className="text-sm leading-relaxed text-foreground/80">
              “HireLoop cut our time-to-hire in half. The quality of candidates in the
              pipeline is on another level.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                MC
              </span>
              <span className="grid">
                <span className="text-sm font-medium text-foreground">Maya Chen</span>
                <span className="text-xs text-muted-foreground">
                  Head of Talent, Northwind
                </span>
              </span>
            </figcaption>
          </figure>
        </section>

        {/* Card */}
        <section className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-8">
          <AuthTabs />
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout
