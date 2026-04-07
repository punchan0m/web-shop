import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { ROUTES } from '@/constants/routes'
import { AdminGuard } from '@/pages/admin/guard'

const HomePage = lazy(() => import('@/pages/home').then((mod) => ({ default: mod.HomePage })))
const ProductsPage = lazy(() => import('@/pages/products').then((mod) => ({ default: mod.ProductsPage })))
const CategoriesPage = lazy(() => import('@/pages/categories').then((mod) => ({ default: mod.CategoriesPage })))
const AboutPage = lazy(() => import('@/pages/about').then((mod) => ({ default: mod.AboutPage })))
const ContactPage = lazy(() => import('@/pages/contact').then((mod) => ({ default: mod.ContactPage })))
const AdminPage = lazy(() => import('@/pages/admin').then((mod) => ({ default: mod.AdminPage })))
const AdminLoginPage = lazy(() => import('@/pages/admin/login').then((mod) => ({ default: mod.AdminLoginPage })))

function RouteFallback() {
  return <div className="p-4 text-sm text-ink/70">Loading...</div>
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppShell />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: ROUTES.products.slice(1), element: withSuspense(<ProductsPage />) },
      { path: ROUTES.categories.slice(1), element: withSuspense(<CategoriesPage />) },
      { path: ROUTES.about.slice(1), element: withSuspense(<AboutPage />) },
      { path: ROUTES.contact.slice(1), element: withSuspense(<ContactPage />) },
      { path: ROUTES.adminLogin.slice(1), element: withSuspense(<AdminLoginPage />) },
      {
        path: ROUTES.admin.slice(1),
        element: <AdminGuard />,
        children: [{ index: true, element: withSuspense(<AdminPage />) }],
      },
    ],
  },
])
