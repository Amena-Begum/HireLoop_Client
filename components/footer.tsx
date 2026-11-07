import Image from "next/image"
import Link from "next/link"
import { MailIcon } from "lucide-react"

import { BackToTop } from "@/components/back-to-top"
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  {
    title: "For Job Seekers",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Companies", href: "/companies" },
      { label: "Pricing", href: "/pricing" },
      { label: "My Applications", href: "/dashboard/seeker/applications" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Post a Job", href: "/dashboard/recruiter/jobs/new" },
      { label: "Pricing", href: "/pricing" },
      { label: "Recruiter Dashboard", href: "/dashboard/recruiter" },
      { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const

function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 lg:px-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-20">
          <div className="flex flex-col items-start gap-5">
            <Link
              href="/"
              aria-label="HireLoop home"
              className="flex shrink-0 items-center"
            >
              <Image
                src="/hireloop-logo.png"
                alt="HireLoop"
                width={154}
                height={44}
                className="h-8 w-auto sm:h-9"
              />
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Smarter job search and faster hiring — all in one place. Built for
              people looking for their next opportunity.
            </p>

            <a
              href="mailto:hello@hireloop.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <MailIcon className="size-4 text-primary" />
              hello@hireloop.com
            </a>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
          >
            {footerLinks.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HireLoop. All rights reserved.</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}

export { Footer }
