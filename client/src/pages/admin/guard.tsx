import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminLoggedIn } from '@/features/auth/admin-auth'
import { ROUTES } from '@/constants/routes'

export function AdminGuard() {
  const location = useLocation()

  if (!isAdminLoggedIn()) {
    return <Navigate to={ROUTES.adminLogin} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
