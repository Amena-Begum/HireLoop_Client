"use client"

import * as React from "react"
import { toast } from "sonner"
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
  const [resumeData, setResumeData] = React.useState<string | null>(null)
  const [resumeType, setResumeType] = React.useState<string | null>(null)
  const [hasSavedResume, setHasSavedResume] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")

  // Prefill the professional fields from the profiles collection.
  React.useEffect(() => {
    let cancelled = false
    fetch("/api/profile")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { profile?: { headline?: string; bio?: string; skills?: string[]; resumeName?: string | null } } | null) => {
        if (cancelled || !data?.profile) return
        setHeadline(data.profile.headline ?? "")
        setBio(data.profile.bio ?? "")
        setSkills((data.profile.skills ?? []).join(", "))
        setResumeFile(data.profile.resumeName ?? null)
        setHasSavedResume(Boolean(data.profile.resumeName))
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

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
      toast.success(nextPhoto ? "Profile photo updated" : "Profile photo removed")
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
    event.target.value = ""
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      setError("Resume must be under 4 MB.")
      return
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error("read failed"))
        reader.readAsDataURL(file)
      })
      setError("")
      setResumeFile(file.name)
      setResumeData(dataUrl)
      setResumeType(file.type || "application/octet-stream")
    } catch {
      setError("That file couldn't be read. Try another one.")
    }
  }

  /** Deletes the stored resume immediately (no Save needed). */
  async function handleResumeRemove() {
    setError("")
    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, bio, skills, resumeChanged: true, resume: null }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null
        setError(data?.message ?? "Couldn't remove the resume. Try again.")
        return
      }
      setResumeFile(null)
      setResumeData(null)
      setResumeType(null)
      setHasSavedResume(false)
      toast.success("Resume removed")
    } catch {
      setError("Network error — try again.")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSaved(false)

    if (!fullName.trim()) {
      setError("Full name is required.")
      return
    }

    setSaving(true)
    try {
      // Name lives on the better-auth user record.
      if (fullName.trim() !== (user.name ?? "")) {
        const { error: nameError } = await authClient.updateUser({
          name: fullName.trim(),
        })
        if (nameError) {
          setError(nameError.message ?? "Couldn't save your name.")
          return
        }
      }

      // Everything else lives in the profiles collection. Only send the
      // resume when it changed, so an untouched saved resume isn't wiped.
      const body: Record<string, unknown> = { headline, bio, skills }
      if (resumeData !== null) {
        body.resumeChanged = true
        body.resume = { name: resumeFile, data: resumeData, type: resumeType }
      }
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null
        setError(data?.message ?? "Couldn't save your profile. Try again.")
        return
      }

      await refetch()
      setHasSavedResume(Boolean(resumeFile))
      setResumeData(null)
      setSaved(true)
      toast.success("Profile saved")
      window.setTimeout(() => setSaved(false), 2500)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
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
              <span className="flex flex-col gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <FileTextIcon className="size-3.5 shrink-0 text-primary" />
                  <span className="min-w-0 truncate font-medium text-foreground">
                    {resumeFile}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  {/* Open only works for the saved copy (not a just-picked file). */}
                  {hasSavedResume && resumeData === null ? (
                    <>
                      <a
                        href="/api/profile/resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Open
                      </a>
                      <span aria-hidden="true">·</span>
                      <a
                        href="/api/profile/resume?download=1"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Download
                      </a>
                      <span aria-hidden="true">·</span>
                    </>
                  ) : (
                    <span className="text-amber-400">
                      Click “Update Profile” to save it first
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleResumeRemove}
                    disabled={saving}
                    className="inline-flex items-center gap-1 text-red-400 underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    <Trash2Icon className="size-3 shrink-0" />
                    {saving ? "Removing…" : "Remove"}
                  </button>
                </span>
              </span>
            )}
          </div>
        </section>

        <Button
          type="submit"
          size="lg"
          disabled={saving}
          className="h-11 w-full rounded-lg text-sm"
        >
          {saving ? "Saving…" : "Update Profile"}
        </Button>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-500/15 px-3 py-2 text-center text-xs font-medium text-red-400"
          >
            {error}
          </p>
        )}
        {saved && !error && (
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
