import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteHomeImage } from '@/features/content/api/content.api'

export function useDeleteHomeImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHomeImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
