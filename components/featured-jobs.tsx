import Link from "next/link"
import { ArrowRightIcon, BriefcaseBusinessIcon, EuroIcon, MapPinIcon } from "lucide-react"

const featuredJobs = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "Frontend Developer",
  description:
    "Showcase your commitment to diversity and inclusion by our initiatives.",
  location: "New York, USA",
  workMode: "Hybrid",
  salary: "€25 - €40/hour",
}))

function FeaturedJobs() {
  return (
    <section
      id="featured-jobs"
      className="border-t border-border/40 bg-[#0a0a0a] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Section header */}
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Smart Job Discovery
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            The roles you&apos;d never find by searching
          </h2>
        </div>

        {/* Jobs grid */}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 sm:mt-14 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <li key={job.id}>
              <article className="flex h-full flex-col gap-5 rounded-xl bg-card p-6 transition-colors hover:border-border hover:bg-card/90">
                <div className="grid content-start gap-2.5">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {job.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <BriefcaseBusinessIcon className="size-3.5 shrink-0 text-primary" />
                    {job.workMode}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-xs text-foreground/90">
                    <EuroIcon className="size-3.5 shrink-0 text-primary" />
                    {job.salary}
                  </span>
                </div>

                <div className="mt-auto pt-1">
                  <Link
                    href="/jobs"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand-soft"
                  >
                    Apply Now
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* View all */}
        <div className="mt-10 flex justify-center sm:mt-14">
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 active:translate-y-px"
          >
            View all job openings
          </Link>
        </div>
      </div>
    </section>
  )
}

export { FeaturedJobs }
