import Image from "next/image"
import Link from "next/link"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"

import bagIcon from "@/app/images/bag-icon.png"
import globeImage from "@/app/images/globe.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const trendingPositions = [
  { label: "Product Designer", query: "product designer" },
  { label: "AI Engineering", query: "ai engineering" },
  { label: "Dev-ops Engineer", query: "devops engineer" },
] as const

const stats = [
  {
    value: "50K",
    label: "Active Jobs",
    icon: BriefcaseBusinessIcon,
  },
  {
    value: "12K",
    label: "Companies",
    icon: Building2Icon,
  },
  {
    value: "2M",
    label: "Job Seekers",
    icon: UsersIcon,
  },
  {
    value: "97%",
    label: "Satisfaction Rate",
    icon: StarIcon,
  },
] as const

function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#0b0b0b] bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url(${globeImage.src})` }}
    >
      {/* Background scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(11,11,11,0.94)_0%,rgba(11,11,11,0.78)_24%,rgba(11,11,11,0.4)_42%,rgba(11,11,11,0.08)_55%,transparent_64%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x bottom-0 -z-10 h-7 bg-gradient-to-t from-background via-background/85 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-16 lg:pb-[72px] lg:pt-[176px]">
        {/* Hero content */}
        <div className="mx-auto flex w-full max-w-[784px] flex-col items-center text-center">
          <div className="flex items-center justify-center">
            <span
              aria-hidden="true"
              className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/30 sm:block"
            />
            <div className="relative rounded-full bg-gradient-to-r from-primary/70 via-white/20 to-primary/70 p-px shadow-[0_0_36px_-6px] shadow-primary/60">
              <div className="flex items-center gap-2 rounded-full bg-background/85 px-5 py-2.5 backdrop-blur-sm sm:gap-3">
                <Image
                  src={bagIcon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-5 shrink-0 object-contain sm:size-6"
                />
                <p className="font-mono text-xs tracking-tight text-foreground/60 sm:text-sm lg:text-lg">
                  <span className="font-bold text-foreground">50,000+</span>{" "}
                  new jobs this month
                </p>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/30 sm:block"
            />
          </div>

          <h1 className="mt-6 text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:mt-8 sm:text-5xl lg:text-[56px]">
            Find Your Dream Job Today
          </h1>

          <p className="mt-4 max-w-[784px] text-pretty text-base leading-relaxed text-foreground/65 sm:text-lg lg:text-xl lg:leading-[1.6]">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          {/* Search */}
          <form
            action="/jobs"
            method="get"
            role="search"
            className="mt-9 flex w-full flex-col gap-2 rounded-2xl border border-white/15 bg-[#101010] p-2 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.08)] sm:mt-12 sm:flex-row sm:items-center sm:gap-0 sm:rounded-2xl"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 sm:px-4">
              <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                aria-label="Job title, skill or company"
                placeholder="Job title, skill or company"
                className="h-12 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground/80 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>

            <span
              aria-hidden="true"
              className="mx-3 h-px bg-white/10 sm:mx-0 sm:h-6 sm:w-px sm:shrink-0"
            />

            <div className="flex items-center gap-2 sm:contents">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 sm:px-4">
                <MapPinIcon className="size-5 shrink-0 text-muted-foreground" />
                <Input
                  type="text"
                  name="location"
                  aria-label="Location or Remote"
                  placeholder="Location or Remote"
                  className="h-12 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground/80 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                />
              </div>

              <Button
                type="submit"
                size="icon-lg"
                aria-label="Search jobs"
                className="size-12 shrink-0 rounded-xl"
              >
                <SearchIcon className="size-5" />
              </Button>
            </div>
          </form>

          {/* Trending */}
          <div className="mt-5 flex flex-col items-center gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <p className="text-sm text-foreground/60 sm:text-base">
              Trending Position
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {trendingPositions.map((position) => (
                <li key={position.query}>
                  <Link
                    href={`/jobs?q=${encodeURIComponent(position.query)}`}
                    className="inline-flex h-8 items-center rounded-full border border-white/15 bg-[#1a1a1b] px-4 text-[13px] font-medium tracking-[-0.005em] text-foreground/85 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-foreground"
                  >
                    {position.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-24 sm:mt-44 lg:mt-[358px]">
          <h2 className="mx-auto max-w-[700px] text-pretty text-center text-[26px] font-medium leading-[1.3] tracking-[-0.01em] text-foreground [text-shadow:0_2px_30px_rgba(0,0,0,0.6)] sm:text-[32px] lg:text-[40px]">
            Assisting over 15,000 job seekers find their dream positions.
          </h2>

          <ul className="mx-auto mt-8 grid max-w-[1320px] grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="group relative flex min-h-[156px] flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(to_bottom,#010102_0%,#0d0d10_48%,#2a2a2d_100%)] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] sm:min-h-[200px] sm:p-6 lg:h-[254px]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100 lg:opacity-0"
                />
                <stat.icon
                  className="size-5 text-foreground/90 sm:size-6"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-[34px] font-semibold leading-none tracking-[-0.02em] text-foreground sm:text-[44px] lg:text-[56px]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-foreground/60 sm:mt-3 sm:text-base lg:text-lg">
                    {stat.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Hero }
