import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/product/api/product.api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}
