import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadImage } from '@/features/image/api/image.api'

export function useUploadImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
