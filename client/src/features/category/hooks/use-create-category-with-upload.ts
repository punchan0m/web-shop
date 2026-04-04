import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategoryWithUpload } from '@/features/category/api/category.api'

export function useCreateCategoryWithUpload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategoryWithUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
