import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(url?: string): string {
  if (!url) return ''

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  const base = import.meta.env.VITE_SUPABASE_URL || ''
  if (!base) return url

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  return `${normalizedBase}${normalizedPath}`
}
