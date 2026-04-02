import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/home'
import { ProductsPage } from '@/pages/products'
import { CategoriesPage } from '@/pages/categories'
import { AboutPage } from '@/pages/about'
import { ContactPage } from '@/pages/contact'
import { AdminPage } from '@/pages/admin'
import { AdminLoginPage } from '@/pages/admin/login'
import { AdminGuard } from '@/pages/admin/guard'

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.products.slice(1), element: <ProductsPage /> },
      { path: ROUTES.categories.slice(1), element: <CategoriesPage /> },
      { path: ROUTES.about.slice(1), element: <AboutPage /> },
      { path: ROUTES.contact.slice(1), element: <ContactPage /> },
      { path: ROUTES.adminLogin.slice(1), element: <AdminLoginPage /> },
      {
        path: ROUTES.admin.slice(1),
        element: <AdminGuard />,
        children: [{ index: true, element: <AdminPage /> }],
      },
    ],
  },
])
