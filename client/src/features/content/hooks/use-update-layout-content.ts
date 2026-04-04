import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLayoutContent } from '@/features/content/api/content.api'

export function useUpdateLayoutContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLayoutContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
