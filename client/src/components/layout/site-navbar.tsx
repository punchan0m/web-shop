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

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 backdrop-blur" style={{ background: 'rgba(249, 249, 252, 0.9)' }}>
      <nav className="flex h-16 w-full items-center justify-between px-4 md:px-8">
        <span className="font-display text-xl font-extrabold tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
          {content.layout.navbarTitle || 'shopname'}
        </span>

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
      </nav>
    </header>
  )
}
