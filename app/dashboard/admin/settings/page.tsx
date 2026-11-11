import type { Metadata } from "next"

import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account details and professional profile.",
}

const AdminSettingsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details and professional profile.
        </p>
      </div>

      <ProfileForm />
    </div>
  )
}

export default AdminSettingsPage
