import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/features/product/components/product-card'
import { useProducts } from '@/features/product/hooks/use-products'
import { useCategories } from '@/features/category/hooks/use-categories'
import { CategoryPill } from '@/features/category/components/category-pill'

const PAGE_SIZE = 20

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategoryId = searchParams.get('category')
  const [categorySearch, setCategorySearch] = useState('')
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(10)
  const [page, setPage] = useState(1)
  const { data: products = [], isLoading: isLoadingProducts } = useProducts()
  const { data: categories = [] } = useCategories()

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name))
  }, [categories])

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

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

    return categoriesWithProducts.filter((category) => category.name.toLowerCase().includes(query))
  }, [sortedCategories, categorySearch, categoryProductCounts])

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return sortedProducts
    }

    return sortedProducts.filter((product) =>
      (product.categories || []).some((category) => category.id === selectedCategoryId),
    )
  }, [sortedProducts, selectedCategoryId])

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
    <section className="grid w-full gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-4 rounded-2xl border border-ink/10 bg-white/80 p-4">
        <input
          type="text"
          value={categorySearch}
          onChange={(event) => {
            setCategorySearch(event.target.value)
            setVisibleCategoryCount(10)
          }}
          placeholder="Search category..."
          className="h-10 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm"
        />

        <div className="max-h-[calc(100vh-260px)] space-y-2 overflow-y-auto pr-1">
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
                name={category.name}
                active={selectedCategoryId === category.id}
              />
            </button>
          ))}
        </div>

        {visibleCategoryCount < filteredCategories.length ? (
          <button
            type="button"
            className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-parchment"
            onClick={() => setVisibleCategoryCount((prev) => prev + 10)}
          >
            ดูเพิ่มเติม ({filteredCategories.length - visibleCategoryCount})
          </button>
        ) : null}
      </aside>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-ink">Product Catalog</h2>

        {isLoadingProducts ? (
          <p className="text-sm text-ink/60">Loading products...</p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {pagedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm">
              <span className="text-ink/70">
                Showing {filteredProducts.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
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
      </div>
    </section>
  )
}
