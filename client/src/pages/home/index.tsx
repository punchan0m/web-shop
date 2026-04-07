import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useCategories } from '@/features/category/hooks/use-categories'
import { useContentSettings } from '@/features/content/content-store'
import { useProducts } from '@/features/product/hooks/use-products'
import { resolveImageUrl } from '@/lib/utils'

export function HomePage() {
  const content = useContentSettings()
  const images = content.home.images.slice(0, 5)
  const { data: categories = [] } = useCategories()
  const { data: products = [] } = useProducts()
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
  const categoryCount = categories.length
  const productCount = products.length
  const imageCount = images.length

  const featuredCategories = [...categories]
    .sort((a, b) => {
      const aCount = products.filter((product) => (product.categories || []).some((category) => category.id === a.id)).length
      const bCount = products.filter((product) => (product.categories || []).some((category) => category.id === b.id)).length
      return bCount - aCount || (a.name || '').localeCompare(b.name || '')
    })
    .slice(0, 4)

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
        <div className="animate-reveal self-start rounded-3xl border border-ink/10 bg-white/90 p-7 shadow-soft">
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

        <div className="relative animate-reveal flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white p-4 shadow-soft">
          <div className="relative min-h-96 flex-1 overflow-hidden rounded-2xl bg-[linear-gradient(140deg,#AE8A37,#D8D3C8)]">
            {currentImage?.url ? (
              <img
                src={resolveImageUrl(currentImage.url)}
                alt={content.home.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.2em] text-white/60">
                ไม่มีรูปภาพ
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

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'หมวดหมู่', value: categoryCount.toString(), note: 'คอลเลกชันที่คัดมาแล้ว' },
          { label: 'สินค้า', value: productCount.toString(), note: 'พร้อมให้เลือกชม' },
          { label: 'รูปหน้าแรก', value: imageCount.toString(), note: 'แก้ไขได้จากหน้าแอดมิน' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/45">{item.label}</p>
            <p className="mt-3 font-display text-3xl font-extrabold text-ink">{item.value}</p>
            <p className="mt-1 text-sm text-ink/65">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/45">ทำไมต้องเลือกที่นี่</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">ทุกอย่างที่คุณต้องการอยู่ในที่เดียว</h2>
          <div className="mt-5 grid gap-3">
            {[
              'เลือกดูสินค้าแยกตามหมวดหมู่ พร้อมจำนวนสินค้าให้เห็นชัดเจน',
              'เปรียบเทียบสินค้าได้ง่ายด้วยราคาและรูปภาพที่ชัดเจน',
            ].map((text) => (
              <div key={text} className="rounded-2xl border border-ink/10 bg-parchment/40 px-4 py-3 text-sm text-ink/75">
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-soft">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/45">หมวดหมู่แนะนำ</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">คอลเลกชันยอดนิยม</h2>
            </div>
            <Link to={ROUTES.categories} className="text-sm font-semibold text-brass transition hover:opacity-80">
              ดูทั้งหมด
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredCategories.length > 0 ? (
              featuredCategories.map((category) => {
                const matchedCount = products.filter((product) => (product.categories || []).some((item) => item.id === category.id)).length

                return (
                  <Link
                    key={category.id}
                    to={`${ROUTES.products}?category=${category.id}`}
                    className="group rounded-2xl border border-ink/10 bg-parchment/30 p-4 transition hover:-translate-y-0.5 hover:border-brass/30 hover:bg-white"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink/45">คอลเลกชัน</p>
                    <p className="mt-2 line-clamp-1 font-display text-lg font-extrabold text-ink">{category.name || 'Untitled'}</p>
                    <p className="mt-2 text-sm text-ink/65">
                      {matchedCount} สินค้า
                    </p>
                    <p className="mt-3 text-sm font-semibold text-brass transition group-hover:translate-x-0.5">
                      ดูคอลเลกชัน
                    </p>
                  </Link>
                )
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-ink/15 p-5 text-sm text-ink/60">
                ยังไม่มีหมวดหมู่ กรุณาเพิ่มจากหน้าแอดมินเพื่อให้ส่วนนี้ใช้งานได้เต็มที่
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
