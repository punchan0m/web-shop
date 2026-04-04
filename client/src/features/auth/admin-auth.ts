const ADMIN_STORAGE_KEY = 'webshop_admin_logged_in'
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin'

export function loginAdmin(email: string, password: string) {
  const isValid = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
  if (isValid) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
  }

  return isValid
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_STORAGE_KEY)
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
}
