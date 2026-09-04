import { Outlet } from 'react-router-dom'

import { PortalHeader } from '@/app/components/PortalHeader'
import { PortalSidebar } from '@/app/components/PortalSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function PortalLayout() {
  return (
    <SidebarProvider>
      <PortalSidebar />
      <SidebarInset>
        <PortalHeader />
        <main className="flex flex-1 flex-col p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
