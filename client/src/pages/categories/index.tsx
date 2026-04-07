import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useCategories } from '@/features/category/hooks/use-categories'
import { useProducts } from '@/features/product/hooks/use-products'
import { resolveImageUrl } from '@/lib/utils'

const PAGE_SIZE = 20
const safeName = (value?: string | null) => value || ''

export function CategoriesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [imageIndexByCategoryId, setImageIndexByCategoryId] = useState<Record<string, number>>({})
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories()
  const { data: products = [] } = useProducts()

  const nextImage = (categoryId: string, imageCount: number) => {
    if (imageCount <= 1) {
      return
    }
    setImageIndexByCategoryId((prev) => {
      const current = prev[categoryId] || 0
      return { ...prev, [categoryId]: current === imageCount - 1 ? 0 : current + 1 }
    })
  }

  const prevImage = (categoryId: string, imageCount: number) => {
    if (imageCount <= 1) {
      return
    }
    setImageIndexByCategoryId((prev) => {
      const current = prev[categoryId] || 0
      return { ...prev, [categoryId]: current === 0 ? imageCount - 1 : current - 1 }
    })
  }

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => safeName(a.name).localeCompare(safeName(b.name)))
  }, [categories])

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return sortedCategories
    }

    return sortedCategories.filter((category) =>
      `${category.name} ${category.description || ''}`.toLowerCase().includes(query),
    )
  }, [sortedCategories, search])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pagedCategories = filteredCategories.slice(start, start + PAGE_SIZE)

  const countByCategoryId = useMemo(() => {
    const map = new Map<string, number>()
    for (const product of products) {
      for (const category of product.categories || []) {
        map.set(category.id, (map.get(category.id) || 0) + 1)
      }
    }
    return map
  }, [products])

  return (
    <section className="mx-auto w-full max-w-[1440px] space-y-10" style={{ color: 'var(--theme-text-primary)' }}>
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--theme-primary)' }}>หมวดหมู่ สินค้า</p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">หมวดหมู่</h1>
        <div className="h-1 w-24" style={{ backgroundColor: 'var(--theme-primary)' }} />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search category..."
          className="h-11 w-full max-w-sm rounded-lg border bg-white px-3 text-sm"
          style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 18%, transparent)' }}
        />
      </div>

      {isLoadingCategories ? (
        <p className="text-sm text-ink/60">Loading categories...</p>
      ) : (
        <>
          <div className="grid gap-8 grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
            {pagedCategories.map((category) => (
              <div
                key={category.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer text-left"
                onClick={() => navigate(`${ROUTES.products}?category=${category.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigate(`${ROUTES.products}?category=${category.id}`)
                  }
                }}
              >
                <Card className="h-full overflow-hidden rounded-none border-0 bg-white p-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ash/40">
                    {(category.images || []).length > 0 ? (
                      <img
                        src={resolveImageUrl((category.images || [])[((imageIndexByCategoryId[category.id] || 0) % (category.images || []).length)]?.url)}
                        alt={category.name}
                        className="h-full w-full object-cover transition-all duration-500 hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-ink/40">
                        No image
                      </div>
                    )}

                    {(category.images || []).length > 1 ? (
                      <>
                        <button
                          type="button"
                          className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/55 text-sm text-white"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            prevImage(category.id, (category.images || []).length)
                          }}
                        >
                          {'<'}
                        </button>
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/55 text-sm text-white"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            nextImage(category.id, (category.images || []).length)
                          }}
                        >
                          {'>'}
                        </button>
                      </>
                    ) : null}
                  </div>

                  <div className="space-y-3 p-7">
                    <p className="line-clamp-1 text-xl font-extrabold uppercase tracking-tight">{category.name}</p>
                    <p className="line-clamp-3 min-h-[60px] text-sm leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                      {category.description || 'Professional category with curated instruments for laboratory and industrial operations.'}
                    </p>
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--theme-primary)' }}>
                      Explore collection <span>{'>'}</span>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--theme-text-secondary)' }}>
                      {countByCategoryId.get(category.id) || 0} product(s)
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm">
            <span style={{ color: 'var(--theme-text-secondary)' }}>
              Showing {filteredCategories.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredCategories.length)} of {filteredCategories.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-ink/15 px-3 py-1 disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </button>
              <span className="min-w-16 text-center">{currentPage} / {totalPages}</span>
              <button
                type="button"
                className="rounded-lg border border-ink/15 px-3 py-1 disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>

        </>
      )}
    </section>
  )
}
