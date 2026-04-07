import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/features/product/components/product-card'
import { useProducts } from '@/features/product/hooks/use-products'
import { useCategories } from '@/features/category/hooks/use-categories'
import { CategoryPill } from '@/features/category/components/category-pill'

const PAGE_SIZE = 20
const safeName = (value?: string | null) => value || ''

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategoryId = searchParams.get('category')
  const [query, setQuery] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'newest'>('name-asc')
  const [categorySearch, setCategorySearch] = useState('')
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(10)
  const [page, setPage] = useState(1)
  const { data: products = [], isLoading: isLoadingProducts } = useProducts()
  const { data: categories = [] } = useCategories()

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => safeName(a.name).localeCompare(safeName(b.name)))
  }, [categories])

  const sortedProducts = useMemo(() => {
    const list = [...products]

    if (sortBy === 'name-desc') {
      return list.sort((a, b) => safeName(b.name).localeCompare(safeName(a.name)))
    }

    if (sortBy === 'newest') {
      return list.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    }

    return list.sort((a, b) => safeName(a.name).localeCompare(safeName(b.name)))
  }, [products, sortBy])

  const categoryProductCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of sortedProducts) {
      for (const category of product.categories || []) {
        counts.set(category.id, (counts.get(category.id) || 0) + 1)
      }
    }
    return counts
  }, [sortedProducts])

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase()
    const categoriesWithProducts = sortedCategories.filter((category) => (categoryProductCounts.get(category.id) || 0) > 0)

    if (!query) {
      return categoriesWithProducts
    }

    return categoriesWithProducts.filter((category) => safeName(category.name).toLowerCase().includes(query))
  }, [sortedCategories, categorySearch, categoryProductCounts])

  const filteredProducts = useMemo(() => {
    const queryLower = query.trim().toLowerCase()
    const cleanedRange = priceRange.replace(/\s+/g, '')
    const rangeMatch = cleanedRange.match(/^(\d+(?:\.\d+)?)?-(\d+(?:\.\d+)?)?$/)
    const rangeStart = rangeMatch?.[1] ? Number(rangeMatch[1]) : undefined
    const rangeEnd = rangeMatch?.[2] ? Number(rangeMatch[2]) : undefined

    return sortedProducts.filter((product) => {
      const categoryMatched = selectedCategoryId
        ? (product.categories || []).some((category) => category.id === selectedCategoryId)
        : true

      const textMatched = queryLower
        ? `${product.name} ${product.description || ''} ${(product.categories || []).map((c) => c.name).join(' ')}`
            .toLowerCase()
            .includes(queryLower)
        : true

      const price = typeof product.price === 'number' ? product.price : undefined
      const rangeMatched = !rangeMatch
        ? true
        : (() => {
            if (typeof price === 'undefined') return false
            if (typeof rangeStart !== 'undefined' && price < rangeStart) return false
            if (typeof rangeEnd !== 'undefined' && price > rangeEnd) return false
            return true
          })()

      return categoryMatched && textMatched && rangeMatched
    })
  }, [sortedProducts, selectedCategoryId, query, priceRange])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pagedProducts = filteredProducts.slice(start, start + PAGE_SIZE)
  const visibleCategories = filteredCategories.slice(0, visibleCategoryCount)

  const selectCategory = (id: string | null) => {
    setPage(1)
    if (!id) {
      setSearchParams({})
      return
    }
    setSearchParams({ category: id })
  }

  return (
    <section className="mx-auto flex w-full max-w-[1440px] gap-8 xl:gap-12" style={{ color: 'var(--theme-text-primary)' }}>
      <aside className="sticky top-24 hidden h-fit w-72 shrink-0 space-y-8 rounded-xl border p-6 lg:block" style={{ background: 'white', borderColor: 'color-mix(in srgb, var(--theme-text-primary) 18%, transparent)' }}>
        <section className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--theme-text-secondary)' }}>Quick search</p>
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search products..."
            className="h-11 w-full rounded-lg border px-3 text-sm"
            style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 16%, transparent)' }}
          />
          <input
            type="text"
            value={priceRange}
            onChange={(event) => {
              setPriceRange(event.target.value)
              setPage(1)
            }}
            placeholder="Price range: start-end (e.g. 100-500)"
            className="h-11 w-full rounded-lg border px-3 text-sm"
            style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 16%, transparent)' }}
          />
        </section>

        <section className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: 'var(--theme-text-secondary)' }}>Categories</p>
          <input
            type="text"
            value={categorySearch}
            onChange={(event) => {
              setCategorySearch(event.target.value)
              setVisibleCategoryCount(10)
            }}
            placeholder="Filter category..."
            className="h-10 w-full rounded-lg border px-3 text-sm"
            style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 16%, transparent)' }}
          />

          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            <button
              type="button"
              className="block w-full min-w-0 text-left"
              onClick={() => selectCategory(null)}
            >
              <CategoryPill name="All categories" active={!selectedCategoryId} />
            </button>

            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="block w-full min-w-0 text-left"
                onClick={() => selectCategory(category.id)}
              >
                <CategoryPill
                  name={`${category.name} (${categoryProductCounts.get(category.id) || 0})`}
                  active={selectedCategoryId === category.id}
                />
              </button>
            ))}
          </div>

          {visibleCategoryCount < filteredCategories.length ? (
            <button
              type="button"
              className="w-full rounded-lg border px-3 py-2 text-sm font-semibold transition"
              style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 16%, transparent)' }}
              onClick={() => setVisibleCategoryCount((prev) => prev + 10)}
            >
              Load more ({filteredCategories.length - visibleCategoryCount})
            </button>
          ) : null}
        </section>
      </aside>

      <div className="min-w-0 flex-1 space-y-8">
        <div className="space-y-4 rounded-xl border p-6" style={{ background: 'color-mix(in srgb, var(--theme-secondary) 35%, white)', borderColor: 'color-mix(in srgb, var(--theme-text-primary) 12%, transparent)' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--theme-primary)' }}>หมวดหมู่สินค้า</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">สินค้าคุณภาพสูง</h1>
              <p className="max-w-2xl text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                ยกระดับมาตรฐานด้วยอุปกรณ์เกรดมืออาชีพ
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--theme-text-secondary)' }}>Sort</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'name-asc' | 'name-desc' | 'newest')}
                className="h-10 rounded-lg border bg-white px-3 text-sm font-semibold"
                style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 16%, transparent)' }}
              >
                <option value="newest">Newest arrivals</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {isLoadingProducts ? (
          <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Loading products...</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-white/85 px-4 py-3 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 14%, transparent)' }}>
              <span style={{ color: 'var(--theme-text-secondary)' }}>
                Showing {filteredProducts.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1 disabled:opacity-40"
                  style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 14%, transparent)' }}
                  disabled={currentPage <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </button>
                <span className="min-w-16 text-center">{currentPage} / {totalPages}</span>
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1 disabled:opacity-40"
                  style={{ borderColor: 'color-mix(in srgb, var(--theme-text-primary) 14%, transparent)' }}
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
