import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { ArrowLeftIcon, BriefcaseBusinessIcon } from "lucide-react"

import { auth } from "@/lib/auth"
import { getJobsCollection } from "@/lib/mongo"
import { EditJobForm } from "@/components/jobs/edit-job-form"
import { EmptyState } from "@/components/dashboard/empty-state"

export const metadata: Metadata = {
  title: "Edit Job Post",
  description: "Update your job post on HireLoop.",
}

// Reads the live session + database on every request.
export const dynamic = "force-dynamic"

const EditJobPage = async ({
  params,
}: {
  params: Promise<{ ref: string }>
}) => {
  const { ref: rawRef } = await params
  const ref = decodeURIComponent(rawRef)

  const session = await auth.api.getSession({ headers: await headers() })
  const job = session
    ? await (
        await getJobsCollection()
      ).findOne({
        ref,
        // Ownership scoped — only the recruiter who posted can edit.
        postedById: session.user.id,
      })
    : null

  if (!job) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Manage Jobs
          </Link>
        </div>
        <EmptyState
          icon={BriefcaseBusinessIcon}
          title="Job post not found"
          iconClassName="bg-amber-500/15 text-amber-400"
          message="This job post doesn't exist, or it belongs to another recruiter."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Manage Jobs
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Edit Job Post
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-mono">{job.ref}</span> · changes are visible to
          job seekers immediately.
        </p>
      </div>

      <EditJobForm
        job={{
          ref: job.ref,
          title: job.title,
          company: job.company,
          description: job.description,
          location: job.location,
          workMode: job.workMode,
          employmentType: job.employmentType,
          currency: job.currency,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          skills: job.skills,
          status: job.status,
        }}
      />
    </div>
  )
}

export default EditJobPage
