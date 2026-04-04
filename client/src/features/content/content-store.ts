import { useQuery } from '@tanstack/react-query'
import { getContent } from '@/features/content/api/content.api'
import type { ContentSettings } from '@/features/content/types'

const defaultContentSettings: ContentSettings = {
  layout: {
    navbarTitle: 'shopname',
    footerLeft: 'Curating with intent since 2026.',
    footerRight: 'shopname',
  },
  home: {
    title: 'Objects with intent, not noise.',
    description:
      'Build your catalog with an editorial feeling. Fast operations in admin, expressive storefront for customers.',
    images: [],
  },
  about: {
    title: 'Curation is a product decision.',
    description:
      'We curate catalog, tone, and interaction as one system. The stack is practical: Router, React Query, Axios, Zod, and focused features.',
    images: [],
  },
  contact: {
    title: 'Studio',
    description: '42 Curator Lane, Design District',
    email: 'support@editorial-merchant.local',
    mapQuery: 'Q8MV+GJ Pak Trae, Ranot District, Songkhla',
    phone: '',
    phoneAlt: '',
    facebook: '',
    instagram: '',
    line: '',
    zoom: 14,
  },
}

export function useContentSettings() {
  const query = useQuery({
    queryKey: ['content'],
    queryFn: getContent,
  })

  return query.data ?? defaultContentSettings
}

export function getDefaultContentSettings() {
  return defaultContentSettings
}
