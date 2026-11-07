import type { Metadata } from "next"
import Link from "next/link"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In | HireLoop",
  description: "Sign in to your HireLoop account to continue your job search.",
}

function SignInPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue your job search with HireLoop.
        </p>
      </div>

      <SignInForm />

      <p className="text-center text-sm text-muted-foreground">
        New to HireLoop?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default SignInPage
