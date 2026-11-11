"use client"

import * as React from "react"
import { FileTextIcon, Trash2Icon, UploadIcon, UserRoundIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { UserAvatar } from "@/components/user-avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Center-crop + shrink to a square data URL so the photo stays small
// enough to store directly on the user record.
async function fileToSquareDataUrl(file: File, size = 256) {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not supported in this browser.")
  const min = Math.min(bitmap.width, bitmap.height)
  ctx.drawImage(
    bitmap,
    (bitmap.width - min) / 2,
    (bitmap.height - min) / 2,
    min,
    min,
    0,
    0,
    size,
    size
  )
  return canvas.toDataURL("image/jpeg", 0.85)
}

function ProfileFields({ user }: { user: { id: string; name?: string | null; email: string; image?: string | null } }) {
  const { refetch } = authClient.useSession()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [fullName, setFullName] = React.useState(user.name ?? "")
  const [headline, setHeadline] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [skills, setSkills] = React.useState("")
  const [resumeFile, setResumeFile] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const [photo, setPhoto] = React.useState(user.image ?? null)
  const [photoBusy, setPhotoBusy] = React.useState(false)
  const [photoError, setPhotoError] = React.useState("")

  async function savePhoto(nextPhoto: string | null) {
    setPhotoBusy(true)
    setPhotoError("")

    try {
      // better-auth stores the image as a string; empty string clears it.
      const { error } = await authClient.updateUser({
        image: nextPhoto ?? "",
      })

      if (error) {
        setPhotoError(error.message ?? "Couldn't save your photo.")
        return
      }

      setPhoto(nextPhoto)
      // Refresh the session so navbar/sidebar avatars update immediately.
      await refetch()
    } catch {
      setPhotoError("Something went wrong while saving your photo.")
    } finally {
      setPhotoBusy(false)
    }
  }

  async function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]
    // Reset the input so picking the same file again still fires change.
    event.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG, PNG, or WebP).")
      return
    }

    try {
      const dataUrl = await fileToSquareDataUrl(file)
      await savePhoto(dataUrl)
    } catch {
      setPhotoError("That image couldn't be processed. Try another one.")
    }
  }

  async function handleResumeChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]
    if (file) setResumeFile(file.name)
  }

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: persist profile fields to your profile API when the backend is ready.
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleUpdateProfile} className="grid gap-6 lg:grid-cols-3">
      {/* Left column: Profile Information + Professional Details */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Profile Information */}
        <section className="rounded-xl border border-border/60 bg-card">
          <div className="border-b border-border/60 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-foreground">
              Profile Information
            </h2>
          </div>
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            {/* Avatar preview + change/remove controls */}
            <div className="flex items-center gap-4">
              <UserAvatar
                name={fullName || user.name}
                image={photo}
                className="size-14"
                iconClassName="size-6"
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoBusy}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {photoBusy
                      ? "Saving…"
                      : photo
                        ? "Change photo"
                        : "Add photo"}
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => savePhoto(null)}
                      disabled={photoBusy}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
                    >
                      <Trash2Icon className="size-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {photo
                    ? "JPG, PNG or WebP. Square-cropped automatically."
                    : "Add a profile photo so recruiters can put a face to the name."}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  aria-label="Profile photo"
                  onChange={handlePhotoChange}
                />
                {photoError && (
                  <p
                    role="alert"
                    className="text-xs font-medium text-red-400"
                  >
                    {photoError}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="fullName" className="text-sm text-foreground/90">
                Full Name
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Amara Okafor"
                className="h-10 bg-background"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm text-foreground/90">
                Email
              </label>
              <Input
                id="email"
                value={user.email}
                readOnly
                disabled
                className="h-10 bg-muted/40 text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Your email can&apos;t be changed.
              </p>
            </div>
          </div>
        </section>

        {/* Professional Details */}
        <section className="rounded-xl border border-border/60 bg-card">
          <div className="border-b border-border/60 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-foreground">
              Professional Details
            </h2>
          </div>
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="grid gap-2">
              <label
                htmlFor="headline"
                className="text-sm text-foreground/90"
              >
                Professional Headline
              </label>
              <Input
                id="headline"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                placeholder="Senior Product Designer · B2B SaaS"
                className="h-10 bg-background"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm text-foreground/90">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                placeholder="Passionate designer with 5+ years of experience crafting user-centric digital experiences..."
                className="w-full resize-none rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="skills" className="text-sm text-foreground/90">
                Skills
              </label>
              <Input
                id="skills"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Prototyping, Design Systems, Figma"
                className="h-10 bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas — recruiters search with these.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Right column: Resume */}
      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-border/60 bg-card">
          <div className="border-b border-border/60 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-foreground">Resume</h2>
          </div>
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <label
              htmlFor="resume"
              className="grid cursor-pointer place-items-center gap-3 rounded-lg border border-dashed border-border p-6 text-center transition-colors hover:border-primary/60"
            >
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-primary/15 text-primary"
              >
                <UploadIcon className="size-4.5" />
              </span>
              <span className="text-sm text-foreground/90 font-medium">
                {resumeFile ?? "Upload Resume"}
              </span>
              <span className="text-xs text-muted-foreground">
                Upload your most recent resume to enable one-click applications.
              </span>
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={handleResumeChange}
              />
            </label>

            {resumeFile && (
              <p className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <FileTextIcon className="size-3.5 shrink-0 text-primary" />
                {resumeFile}
              </p>
            )}
          </div>
        </section>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full rounded-lg text-sm"
        >
          Update Profile
        </Button>
        {saved && (
          <p
            role="status"
            className="rounded-lg bg-emerald-500/15 px-3 py-2 text-center text-xs font-medium text-emerald-400"
          >
            Profile saved.
          </p>
        )}
      </div>
    </form>
  )
}

function ProfileForm() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>
  }

  // Signed-out state
  if (!user) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid size-12 place-items-center rounded-full bg-primary/15 text-primary"
        >
          <UserRoundIcon className="size-5" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Sign in to view your profile
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Your profile powers one-click applications and recruiter discovery.
        </p>
        <a
          href="/sign-in"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Sign in
        </a>
      </div>
    )
  }

  // Keyed on the user id so the fields prefill from the session exactly
  // once — no setState inside an effect.
  return <ProfileFields key={user.id} user={user} />
}

export { ProfileForm }
