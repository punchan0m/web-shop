import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProduct } from '@/features/product/api/product.api'
import type { UpdateProductInput } from '@/features/product/types'

type UpdateProductVariables = {
  id: string
  data: UpdateProductInput
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductVariables) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
