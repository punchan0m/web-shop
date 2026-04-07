import { useContentSettings } from '@/features/content/content-store'

export function SiteFooter() {
  const content = useContentSettings()

  return (
    <footer className="border-t border-ink/10" style={{ background: 'color-mix(in srgb, var(--theme-secondary) 30%, white)' }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs md:flex-row md:items-center md:justify-between md:px-8" style={{ color: 'var(--theme-text-secondary)' }}>
        <p>{content.layout.footerLeft || 'Curating with intent since 2026.'}</p>
        <p>{content.layout.footerRight || content.layout.navbarTitle || 'shopname'}</p>
      </div>
    </footer>
  )
}
