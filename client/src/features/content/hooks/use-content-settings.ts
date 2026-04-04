import { useQuery } from '@tanstack/react-query'
import { getContent } from '@/features/content/api/content.api'
import { getDefaultContentSettings } from '@/features/content/content-store'

export function useContentSettings() {
  const query = useQuery({
    queryKey: ['content'],
    queryFn: getContent,
  })

  return query.data ?? getDefaultContentSettings()
}
