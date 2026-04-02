type CategoryPillProps = {
  name: string
  active?: boolean
}

export function CategoryPill({ name, active }: CategoryPillProps) {
  return (
    <span
      className={[
        'inline-flex max-w-full truncate rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        active ? 'border-brass bg-brass text-white' : 'border-ink/20 bg-white text-ink/70',
      ].join(' ')}
    >
      {name}
    </span>
  )
}
