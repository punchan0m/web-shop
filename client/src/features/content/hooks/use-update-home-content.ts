import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateHomeContent } from '@/features/content/api/content.api'

export function useUpdateHomeContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateHomeContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
