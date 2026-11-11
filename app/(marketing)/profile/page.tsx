import type { Metadata } from "next"

import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Your Profile",
  description:
    "Manage your account details and professional profile on HireLoop.",
}

const ProfilePage = () => {
  return (
    <main className="min-h-svh py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-16">
        {/* Page header */}
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
            Your Account
            <span aria-hidden="true" className="block size-1.5 bg-primary" />
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-3 text-muted-foreground">
            Manage your account details and professional profile.
          </p>
        </div>

        <div className="mt-10">
          <ProfileForm />
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
