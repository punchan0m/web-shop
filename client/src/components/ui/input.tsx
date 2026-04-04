import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20',
        className,
      )}
      {...props}
    />
  )
}
