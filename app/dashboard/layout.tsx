import { SidebarProvider } from "@/components/ui/sidebar"
import { RoleGate } from "@/components/dashboard/role-gate"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/header"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGate>
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex min-h-svh w-full min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </SidebarProvider>
    </RoleGate>
  )
}

export default DashboardLayout
