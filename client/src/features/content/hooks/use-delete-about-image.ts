import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteImage } from '@/features/image/api/image.api'

export function useDeleteAboutImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
