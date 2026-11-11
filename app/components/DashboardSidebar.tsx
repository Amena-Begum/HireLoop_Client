"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2Icon,
  BriefcaseBusinessIcon,
  BookmarkIcon,
  DownloadIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Logo } from "@/components/navbar"
import { UserAvatar } from "@/components/user-avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Role = "seeker" | "recruiter" | "admin"

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

const NAV: Record<Role, NavItem[]> = {
  seeker: [
    { title: "Dashboard", href: "/dashboard/seeker", icon: LayoutDashboardIcon },
    { title: "Jobs", href: "/dashboard/seeker/jobs", icon: BriefcaseBusinessIcon },
    { title: "Saved Jobs", href: "/dashboard/seeker/saved", icon: BookmarkIcon },
    { title: "Applications", href: "/dashboard/seeker/applications", icon: FileTextIcon },
    { title: "Billing", href: "/dashboard/seeker/billing", icon: WalletIcon },
    { title: "Settings", href: "/dashboard/seeker/settings", icon: SettingsIcon },
  ],
  recruiter: [
    { title: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboardIcon },
    { title: "My Company", href: "/dashboard/recruiter/company", icon: Building2Icon },
    { title: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: BriefcaseBusinessIcon },
    { title: "Applications", href: "/dashboard/recruiter/applications", icon: FileTextIcon },
    { title: "Settings", href: "/dashboard/recruiter/settings", icon: SettingsIcon },
  ],
  admin: [
    { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboardIcon },
    { title: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
    { title: "Companies", href: "/dashboard/admin/companies", icon: Building2Icon },
    { title: "Jobs", href: "/dashboard/admin/jobs", icon: BriefcaseBusinessIcon },
    { title: "Payments", href: "/dashboard/admin/payments", icon: WalletIcon },
    { title: "Settings", href: "/dashboard/admin/settings", icon: SettingsIcon },
  ],
}

const ROLE_LABEL: Record<Role, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Administrator",
}

const ROLE_PLAN: Record<Role, string> = {
  seeker: "Free Plan",
  recruiter: "Pro Plan",
  admin: "Admin Access",
}

const ROLE_CTA: Record<Role, { label: string; href: string; icon: LucideIcon }> = {
  seeker: {
    label: "Upgrade Plan",
    href: "/dashboard/seeker/billing",
    icon: SparklesIcon,
  },
  recruiter: {
    label: "Create Job Post",
    href: "/dashboard/recruiter/jobs/create",
    icon: PlusIcon,
  },
  admin: {
    label: "Export Report",
    href: "/dashboard/admin/payments",
    icon: DownloadIcon,
  },
}

function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()

  const role = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/recruiter")
      ? "recruiter"
      : "seeker"

  const user = session?.user
  const name = user?.name ?? "Guest User"
  const cta = ROLE_CTA[role]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/60 p-4">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="flex h-8 items-center group-data-[collapsible=icon]:justify-center"
        >
          <Logo className="h-7 w-auto" />
        </Link>

        {/* Identity block — links to /profile */}
        <Link
          href="/profile"
          aria-label="Open your profile"
          className="mt-3 flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 transition-colors hover:border-border group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <UserAvatar name={name} image={user?.image} />
          <span className="grid min-w-0 gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-foreground">
              {name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {ROLE_LABEL[role]}
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            {ROLE_LABEL[role]}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV[role].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.title}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-3 group-data-[collapsible=icon]:px-1">
        {/* Plan badge */}
        <div className="mb-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary group-data-[collapsible=icon]:hidden">
          {ROLE_PLAN[role]}
        </div>
        {/* CTA */}
        <div className="mb-1">
          <SidebarMenuButton
            render={<Link href={cta.href} />}
            tooltip={cta.label}
            className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
          >
            <cta.icon className="size-4" />
            <span>{cta.label}</span>
          </SidebarMenuButton>
        </div>
        {/* Logout */}
        <div>
          <SidebarMenuButton
            tooltip="Log Out"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => authClient.signOut()}
          >
            <LogOutIcon className="size-4" />
            <span>Log Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export { DashboardSidebar }
