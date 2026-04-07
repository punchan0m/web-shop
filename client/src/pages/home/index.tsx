import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useContentSettings } from '@/features/content/content-store'
import { resolveImageUrl } from '@/lib/utils'

export function HomePage() {
  const content = useContentSettings()
  const images = content.home.images.slice(0, 5)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 2000)

    return () => window.clearInterval(timer)
  }, [images.length])

  const currentImage = images[currentImageIndex]

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        <div className="animate-reveal rounded-3xl border border-ink/10 bg-white/90 p-7 shadow-soft">
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            {content.home.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink/70 md:text-lg">
            {content.home.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={ROUTES.products}
              className="inline-flex h-11 items-center rounded-xl bg-brass px-5 text-sm font-semibold text-white transition hover:bg-[#8f722f]"
            >
              ดูสินค้า
            </Link>
            <Link
              to={ROUTES.categories}
              className="inline-flex h-11 items-center rounded-xl border border-ink/15 bg-white px-5 text-sm font-semibold text-ink transition hover:bg-parchment"
            >
              ดูหมวดหมู่
            </Link>
          </div>
        </div>

        <div className="relative animate-reveal overflow-hidden rounded-3xl border border-ink/10 bg-white p-4 shadow-soft">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[linear-gradient(140deg,#AE8A37,#D8D3C8)]">
            {currentImage?.url ? (
              <img
                src={resolveImageUrl(currentImage.url)}
                alt={content.home.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.2em] text-white/60">
                No image
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">{content.layout.navbarTitle || 'shopname'}</p>
              <p className="mt-1 line-clamp-2 break-words text-sm font-semibold text-white">
                {content.home.title}
              </p>
            </div>

            {images.length > 1 ? (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-black/45 px-2 py-1">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full transition ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
