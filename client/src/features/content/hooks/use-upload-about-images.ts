import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadImage } from '@/features/image/api/image.api'

export function useUploadAboutImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: File[]) => Promise.all(files.map(file => uploadImage({ file, contentSection: 'about' }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
