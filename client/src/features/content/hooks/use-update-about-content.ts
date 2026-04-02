import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAboutContent } from '@/features/content/api/content.api'

export function useUpdateAboutContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAboutContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
