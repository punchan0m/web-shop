import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductWithUpload } from '@/features/product/api/product.api'

export function useCreateProductWithUpload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductWithUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
