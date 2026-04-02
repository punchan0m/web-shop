import { useContentSettings } from '@/features/content/content-store'

export function SiteFooter() {
  const content = useContentSettings()

  return (
    <footer className="border-t border-ink/10 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-ink/60 md:flex-row md:items-center md:justify-between md:px-8">
        <p>{content.layout.footerLeft || 'Curating with intent since 2026.'}</p>
        <p>{content.layout.footerRight || content.layout.navbarTitle || 'shopname'}</p>
      </div>
    </footer>
  )
}
