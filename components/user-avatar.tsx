"use client"

import Image from "next/image"
import { UserRoundIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function UserAvatar({
  name,
  image,
  className,
  iconClassName,
}: {
  name?: string | null
  image?: string | null
  className?: string
  iconClassName?: string
}) {
  // Show the profile image when the user has one (e.g. from Google),
  // otherwise fall back to an icon.
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "Profile"}
        width={36}
        height={36}
        unoptimized
        className={cn("size-9 shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      title={name ?? undefined}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-primary",
        className
      )}
    >
      <UserRoundIcon className={cn("size-4.5", iconClassName)} />
    </span>
  )
}

export { UserAvatar }
