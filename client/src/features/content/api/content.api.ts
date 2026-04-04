import { apiClient } from '@/services/api-client'
import type {
  AboutContent,
  ContactContent,
  ContentSettings,
  HomeContent,
  LayoutContent,
} from '@/features/content/types'

type ApiContentSettings = {
  siteName?: string
  footerLeft?: string
  footerRight?: string
  homeTitle?: string
  homeDescription?: string
  homeImages?: Array<{ id?: string; url?: string }>
  aboutTitle?: string
  aboutDescription?: string
  aboutImages?: Array<{ id?: string; url?: string }>
  contactTitle?: string
  contactDescription?: string
  contactMapQuery?: string
  contactEmail?: string
  contactGmail?: string
  contactPhone?: string
  contactPhoneAlt?: string
  contactFacebook?: string
  contactInstagram?: string
  contactLine?: string
  contactZoom?: number
}

function normalizeImages(images?: Array<{ id?: string; url?: string }>) {
  return (images || [])
    .filter((image) => Boolean(image?.id && image?.url))
    .map((image) => ({ id: image.id as string, url: image.url as string }))
}

function normalizeContent(raw: ApiContentSettings): ContentSettings {
  return {
    layout: {
      navbarTitle: raw.siteName || 'shopname',
      footerLeft: raw.footerLeft || 'Curating with intent since 2026.',
      footerRight: raw.footerRight || 'shopname',
    },
    home: {
      title: raw.homeTitle || 'Objects with intent, not noise.',
      description: raw.homeDescription || '',
      images: normalizeImages(raw.homeImages),
    },
    about: {
      title: raw.aboutTitle || 'Curation is a product decision.',
      description: raw.aboutDescription || '',
      images: normalizeImages(raw.aboutImages),
    },
    contact: {
      title: raw.contactTitle || 'Studio',
      description: raw.contactDescription || '',
      email: raw.contactEmail || 'support@editorial-merchant.local',
      mapQuery: raw.contactMapQuery || 'Q8MV+GJ Pak Trae, Ranot District, Songkhla',
      phone: raw.contactPhone || '',
      phoneAlt: raw.contactPhoneAlt || '',
      facebook: raw.contactFacebook || '',
      instagram: raw.contactInstagram || '',
      line: raw.contactLine || '',
      zoom: typeof raw.contactZoom === 'number' ? raw.contactZoom : 14,
    },
  }
}

function toFormData(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  return formData
}

export async function getContent(): Promise<ContentSettings> {
  const res = await apiClient.get<ApiContentSettings>('/content')
  return normalizeContent(res.data)
}

export async function updateLayoutContent(data: LayoutContent): Promise<ContentSettings> {
  const res = await apiClient.patch<ApiContentSettings>('/content/layout', data)
  return normalizeContent(res.data)
}

export async function updateHomeContent(data: HomeContent & { siteName?: string }): Promise<ContentSettings> {
  const res = await apiClient.patch<ApiContentSettings>('/content/home', data)
  return normalizeContent(res.data)
}

export async function updateAboutContent(data: AboutContent): Promise<ContentSettings> {
  const res = await apiClient.patch<ApiContentSettings>('/content/about', data)
  return normalizeContent(res.data)
}

export async function updateContactContent(data: ContactContent): Promise<ContentSettings> {
  const res = await apiClient.patch<ApiContentSettings>('/content/contact', data)
  return normalizeContent(res.data)
}

export async function uploadHomeImages(files: File[]): Promise<ContentSettings> {
  const res = await apiClient.post<ApiContentSettings>('/content/home/images', toFormData(files))
  return normalizeContent(res.data)
}

export async function uploadAboutImages(files: File[]): Promise<ContentSettings> {
  const res = await apiClient.post<ApiContentSettings>('/content/about/images', toFormData(files))
  return normalizeContent(res.data)
}

export async function deleteHomeImage(imageId: string): Promise<ContentSettings> {
  const res = await apiClient.delete<ApiContentSettings>(`/content/home/images/${imageId}`)
  return normalizeContent(res.data)
}

export async function deleteAboutImage(imageId: string): Promise<ContentSettings> {
  const res = await apiClient.delete<ApiContentSettings>(`/content/about/images/${imageId}`)
  return normalizeContent(res.data)
}
