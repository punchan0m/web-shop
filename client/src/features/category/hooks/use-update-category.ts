import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategory } from '@/features/category/api/category.api'
import type { UpdateCategoryInput } from '@/features/category/types'

type UpdateCategoryVariables = {
  id: string
  data: UpdateCategoryInput
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryVariables) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
