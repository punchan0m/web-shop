import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useCategories } from '@/features/category/hooks/use-categories'
import { useProducts } from '@/features/product/hooks/use-products'

const PAGE_SIZE = 20

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
    return [...categories].sort((a, b) => a.name.localeCompare(b.name))
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
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold text-ink">Categories</h2>
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search category..."
          className="w-full max-w-sm"
        />
      </div>

      {isLoadingCategories ? (
        <p className="text-sm text-ink/60">Loading categories...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {pagedCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="text-left"
                onClick={() => navigate(`${ROUTES.products}?category=${category.id}`)}
              >
                <Card className="h-full space-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ash/40">
                    {(category.images || []).length > 0 ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${(category.images || [])[((imageIndexByCategoryId[category.id] || 0) % (category.images || []).length)]?.url}`}
                        alt={category.name}
                        className="h-full w-full object-cover"
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

                  <p className="truncate font-display text-lg font-bold text-ink">{category.name}</p>
                  <p className="line-clamp-2 min-h-10 break-words text-sm text-ink/70">
                    {category.description || 'No description'}
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-brass">
                    {countByCategoryId.get(category.id) || 0} product(s)
                  </p>
                </Card>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm">
            <span className="text-ink/70">
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
