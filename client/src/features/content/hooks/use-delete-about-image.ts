import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAboutImage } from '@/features/content/api/content.api'

export function useDeleteAboutImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAboutImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
