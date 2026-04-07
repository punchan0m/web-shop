import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadImage } from '@/features/image/api/image.api'

export function useUploadHomeImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: File[]) => Promise.all(files.map(file => uploadImage({ file, contentSection: 'home' }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
