import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--theme-button-bg)] text-[var(--theme-button-text)] hover:opacity-90',
        ghost: 'bg-transparent text-ink hover:bg-ash/50',
        outline: 'border border-ink/20 bg-white text-ink hover:bg-parchment',
      },
      size: {
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
