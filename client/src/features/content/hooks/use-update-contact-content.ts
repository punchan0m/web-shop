import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateContactContent } from '@/features/content/api/content.api'

export function useUpdateContactContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateContactContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
  })
}
