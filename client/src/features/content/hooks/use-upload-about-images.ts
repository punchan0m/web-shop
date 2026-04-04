import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAboutImages } from '@/features/content/api/content.api'

export function useUploadAboutImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadAboutImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
