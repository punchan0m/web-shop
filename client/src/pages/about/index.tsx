import { useContentSettings } from '@/features/content/content-store'

export function AboutPage() {
  const content = useContentSettings()
  const images = content.about.images.slice(0, 20)

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="rounded-3xl border border-ink/10 bg-white/90 p-7 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brass">About us</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            {content.about.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink/70">
            {content.about.description}
          </p>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-white p-4 shadow-soft">
          {images[0]?.url ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${images[0].url}`}
              alt={content.about.title}
              className="h-[360px] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-2xl bg-parchment text-sm uppercase tracking-[0.2em] text-ink/40">
              No image
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-soft">
            <img src={`${import.meta.env.VITE_API_URL}${image.url}`} alt={content.about.title} className="h-44 w-full rounded-xl object-cover" />
          </article>
        ))}
        {images.length === 0 ? <p className="text-sm text-ink/60">No images yet.</p> : null}
      </div>
    </section>
  )
}
