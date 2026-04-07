import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { useContentSettings } from '@/features/content/content-store'

export function AppShell() {
  const content = useContentSettings()

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', content.theme.primary)
    root.style.setProperty('--theme-secondary', content.theme.secondary)
    root.style.setProperty('--theme-text-primary', content.theme.textPrimary)
    root.style.setProperty('--theme-text-secondary', content.theme.textSecondary)
    root.style.setProperty('--theme-button-bg', content.theme.buttonBg)
    root.style.setProperty('--theme-button-text', content.theme.buttonText)
  }, [content.theme.primary, content.theme.secondary, content.theme.textPrimary, content.theme.textSecondary, content.theme.buttonBg, content.theme.buttonText])

  return (
    <div className="grain flex min-h-screen flex-col bg-halo" style={{ color: 'var(--theme-text-primary)' }}>
      <SiteNavbar />
      <main className="w-full flex-1 px-4 py-8 md:px-8 md:py-12">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
