"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
] as const

const SIGN_IN_HREF = "/sign-in"
const GET_STARTED_HREF = "/sign-up"

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/hireloop-logo.png"
      alt="HireLoop"
      width={154}
      height={44}
      priority
      className={cn("h-7 w-auto sm:h-8 lg:h-9", className)}
    />
  )
}

function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { data: session } = authClient.useSession()
  const user = session?.user ?? null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[92px] lg:px-16">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="flex shrink-0 items-center"
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  isActive(pathname, link.href) ? "page" : undefined
                }
                className={cn(
                  "text-[15px] font-medium transition-colors",
                  isActive(pathname, link.href)
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <span aria-hidden="true" className="h-5 w-px bg-border" />

          <div className="flex items-center gap-8">
            {user ? (
              <>
                <span
                  className="max-w-[200px] truncate text-sm text-foreground/70"
                  title={user.email}
                >
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-lg px-6 text-[15px]"
                  onClick={() => authClient.signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={SIGN_IN_HREF}
                  className="text-[15px] font-medium text-brand-soft transition-colors hover:text-brand-soft/80"
                >
                  Sign In
                </Link>
                <Link
                  href={GET_STARTED_HREF}
                  className={buttonVariants({
                    className: "h-11 rounded-lg px-6 text-[15px]",
                  })}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[85%] gap-0 border-border bg-background p-0 sm:max-w-xs"
          >
            <SheetHeader className="border-b border-border p-5">
              <SheetTitle className="sr-only">Site navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Links to navigate the HireLoop website.
              </SheetDescription>
              <Link
                href="/"
                aria-label="HireLoop home"
                onClick={() => setOpen(false)}
                className="flex items-center"
              >
                <Logo className="h-7" />
              </Link>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 p-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    isActive(pathname, link.href) ? "page" : undefined
                  }
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted hover:text-foreground",
                    isActive(pathname, link.href)
                      ? "text-foreground"
                      : "text-foreground/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <SheetFooter className="border-t border-border p-4">
              {user ? (
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-lg text-[15px]"
                  onClick={() => {
                    authClient.signOut()
                    setOpen(false)
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link
                    href={SIGN_IN_HREF}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      className: "h-11 w-full rounded-lg text-[15px]",
                    })}
                  >
                    Sign In
                  </Link>
                  <Link
                    href={GET_STARTED_HREF}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({
                      className: "h-11 w-full rounded-lg text-[15px]",
                    })}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { Navbar }
