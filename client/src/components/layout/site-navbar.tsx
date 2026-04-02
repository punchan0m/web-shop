import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useContentSettings } from '@/features/content/content-store'

const navItems = [
  { label: 'Home', to: ROUTES.home },
  { label: 'Category', to: ROUTES.categories },
  { label: 'Product', to: ROUTES.products },
  { label: 'About', to: ROUTES.about },
  { label: 'Contect', to: ROUTES.contact },
]

export function SiteNavbar() {
  const content = useContentSettings()

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-parchment/90 backdrop-blur">
      <nav className="flex h-16 w-full items-center justify-between px-4 md:px-8">
        <span className="font-display text-xl font-extrabold tracking-tight text-ink">
          {content.layout.navbarTitle || 'shopname'}
        </span>

        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold text-ink/70 transition hover:text-ink',
                  isActive && 'text-brass',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
