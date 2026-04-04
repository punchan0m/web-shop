import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadHomeImages } from '@/features/content/api/content.api'

export function useUploadHomeImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadHomeImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
