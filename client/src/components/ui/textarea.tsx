import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-24 max-h-52 w-full resize-y rounded-xl border border-ink/15 bg-white p-3 text-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/20',
        className,
      )}
      {...props}
    />
  )
}
