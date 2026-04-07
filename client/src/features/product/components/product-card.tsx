import { useMemo, useState } from 'react'
import type { Product } from '@/features/product/types'
import { Card } from '@/components/ui/card'
import { resolveImageUrl } from '@/lib/utils'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const images = useMemo(() => product.images || [], [product.images])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const currentImage = images[currentImageIndex]
  const formattedPrice = typeof product.price === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
    : 'N/A'

  const goPrev = () => {
    if (images.length <= 1) {
      return
    }
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goNext = () => {
    if (images.length <= 1) {
      return
    }
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="w-full cursor-pointer text-left"
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        <Card className="overflow-hidden p-0">
          <div className="relative aspect-[4/3] bg-ash/40">
            {currentImage?.url ? (
              <img
                src={resolveImageUrl(currentImage.url)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-ink/40">
                No image
              </div>
            )}

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    goPrev()
                  }}
                  className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/55 text-sm text-white"
                >
                  {'<'}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    goNext()
                  }}
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/55 text-sm text-white"
                >
                  {'>'}
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-1 text-[10px] text-white">
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            ) : null}
          </div>

          <div className="space-y-2 p-4">
            <p className="truncate text-xs uppercase tracking-[0.2em] text-brass">
              {(product.categories || []).map((item) => item.name).join(' / ') || 'Uncategorized'}
            </p>
            <h3 className="truncate font-display text-lg font-bold text-ink">{product.name}</h3>
            <p className="text-sm font-extrabold text-ink">{formattedPrice}</p>
            <p className="line-clamp-2 min-h-10 break-words text-sm text-ink/70">{product.description || 'No description yet.'}</p>
          </div>
        </Card>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4" onClick={(event) => event.stopPropagation()}>
            {images.length > 0 ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ash/40">
                <img
                  src={resolveImageUrl(images[currentImageIndex]?.url)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-lg text-white"
                    >
                      {'<'}
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-lg text-white"
                    >
                      {'>'}
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3 space-y-2">
              <p className="truncate text-xs uppercase tracking-[0.2em] text-brass">
                {(product.categories || []).map((item) => item.name).join(' / ') || 'Uncategorized'}
              </p>
              <h3 className="line-clamp-2 break-words font-display text-2xl font-bold text-ink">{product.name}</h3>
              <p className="text-base font-extrabold text-ink">{formattedPrice}</p>
              <p className="max-h-48 overflow-y-auto break-words text-sm text-ink/75">{product.description || 'No description yet.'}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-ink/60">
                {images.length > 0 ? `Image ${currentImageIndex + 1}/${images.length}` : 'No images'}
              </span>
              <button
                type="button"
                className="rounded-lg border border-ink/20 px-3 py-1 text-sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
