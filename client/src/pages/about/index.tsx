import { useContentSettings } from '@/features/content/content-store'
import { resolveImageUrl } from '@/lib/utils'

export function AboutPage() {
  const content = useContentSettings()
  const about = content.about
  const title = about?.title?.trim() || 'เกี่ยวกับเรา'
  const description =
    about?.description?.trim() ||
    'เราคัดสรรสินค้าและประสบการณ์การใช้งานอย่างตั้งใจ เพื่อให้ทุกการเลือกซื้อง่ายและชัดเจนขึ้น'
  const images = (about?.images || []).filter((image) => Boolean(image?.id) && Boolean(image?.url)).slice(0, 20)
  const heroImage = images[0]

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="min-w-0 rounded-3xl border border-ink/10 bg-white/90 p-5 shadow-soft md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brass">เกี่ยวกับเรา</p>
          <h1 className="mt-3 break-words font-display text-3xl font-extrabold leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl break-words text-lg leading-relaxed text-ink/70">
            {description}
          </p>
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl border border-ink/10 bg-white p-4 shadow-soft">
          {heroImage?.url ? (
            <img
              src={resolveImageUrl(heroImage.url)}
              alt={title}
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
            <img src={resolveImageUrl(image.url)} alt={title} className="h-44 w-full rounded-xl object-cover" />
          </article>
        ))}
        {images.length === 0 ? <p className="text-sm text-ink/60">No images yet.</p> : null}
      </div>
    </section>
  )
}
