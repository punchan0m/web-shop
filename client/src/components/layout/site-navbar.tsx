import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useContentSettings } from '@/features/content/content-store'

const navItems = [
  { label: 'หน้าแรก', to: ROUTES.home },
  { label: 'หมวดหมู่', to: ROUTES.categories },
  { label: 'สินค้า', to: ROUTES.products },
  { label: 'เกี่ยวกับเรา', to: ROUTES.about },
  { label: 'ติดต่อ', to: ROUTES.contact },
]

export function SiteNavbar() {
  const content = useContentSettings()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 backdrop-blur" style={{ background: 'rgba(249, 249, 252, 0.9)' }}>
      <nav className="flex h-16 w-full items-center justify-between px-4 md:px-8">
        <span className="font-display text-xl font-extrabold tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
          {content.layout.navbarTitle || 'shopname'}
        </span>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold transition',
                  isActive && 'font-bold',
                )
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--theme-primary)' : 'var(--theme-text-secondary)',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          type="button"
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ color: 'var(--theme-text-primary)' }}
        >
          <span className={`h-0.5 w-6 transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} style={{ backgroundColor: 'currentColor' }} />
          <span className={`h-0.5 w-6 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: 'currentColor' }} />
          <span className={`h-0.5 w-6 transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} style={{ backgroundColor: 'currentColor' }} />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-ink/10 bg-white md:hidden" style={{ background: 'rgba(249, 249, 252, 0.95)' }}>
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'block rounded-lg px-3 py-2 text-sm font-semibold transition',
                    isActive ? 'font-bold' : '',
                  )
                }
                style={({ isActive }) => ({
                  color: isActive ? 'white' : 'var(--theme-text-secondary)',
                  backgroundColor: isActive ? 'var(--theme-primary)' : 'transparent',
                })}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
