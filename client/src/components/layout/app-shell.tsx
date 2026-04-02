import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNavbar } from '@/components/layout/site-navbar'

export function AppShell() {
  return (
    <div className="grain flex min-h-screen flex-col bg-halo">
      <SiteNavbar />
      <main className="w-full flex-1 px-4 py-8 md:px-8 md:py-12">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
