import type { Metadata } from "next"
import Link from "next/link"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | HireLoop",
  description: "Create your HireLoop account as a job seeker or recruiter.",
}

function SignUpPage() {
  
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join HireLoop as a job seeker or a recruiter — it takes less than a minute.
        </p>
      </div>

      <SignUpForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignUpPage
