import {
  BookmarkIcon,
  Building2Icon,
  FileTextIcon,
  LineChartIcon,
  SearchIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react"

const features = [
  {
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
    icon: SearchIcon,
  },
  {
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
    icon: LineChartIcon,
  },
  {
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
    icon: Building2Icon,
  },
  {
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
    icon: BookmarkIcon,
  },
  {
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process!",
    icon: SparklesIcon,
  },
  {
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
    icon: FileTextIcon,
  },
  {
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
    icon: TargetIcon,
  },
  {
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
    icon: TrendingUpIcon,
  },
]

function Features() {
  return (
    <section
      id="features"
      className="border-t border-border/40 bg-[#0a0a0a] py-16 sm:py-20 lg:py-24"
    >
      {/* Shared gradient for feature icons */}
      <svg aria-hidden="true" className="absolute size-0 overflow-hidden">
        <defs>
          <linearGradient
            id="feature-icon-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16">
        {/* Section header */}
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Features Job
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything you need to succeed
          </h2>
        </div>

        {/* Features grid */}
        <ul className="mx-auto mt-10 grid max-w-[1200px] grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:mt-14 lg:grid-cols-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <feature.icon
                  className="size-5"
                  style={{ stroke: "url(#feature-icon-gradient)" }}
                />
              </span>
              <div className="grid content-start gap-1.5">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { Features }
