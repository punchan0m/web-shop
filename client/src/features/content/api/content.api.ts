import { supabase } from '@/lib/supabase'
import type {
  AboutContent,
  ContactContent,
  ContentSettings,
  HomeContent,
  LayoutContent,
  ThemeContent,
} from '@/features/content/types'

type ApiContentSettings = {
  id?: string
  site_name?: string
  footer_left?: string
  footer_right?: string
  theme_primary?: string
  theme_secondary?: string
  theme_text_primary?: string
  theme_text_secondary?: string
  theme_button_bg?: string
  theme_button_text?: string
  home_title?: string
  home_description?: string
  about_title?: string
  about_description?: string
  contact_title?: string
  contact_description?: string
  contact_map_query?: string
  contact_email?: string
  contact_gmail?: string
  contact_phone?: string
  contact_phone_alt?: string
  contact_facebook?: string
  contact_instagram?: string
  contact_line?: string
  contact_zoom?: number
}

const defaultContent: ContentSettings = {
  layout: {
    navbarTitle: 'shopname',
    footerLeft: 'Curating with intent since 2026.',
    footerRight: 'shopname',
  },
  theme: {
    primary: '#705d00',
    secondary: '#e8e2d9',
    textPrimary: '#2d3339',
    textSecondary: '#596066',
    buttonBg: '#705d00',
    buttonText: '#ffffff',
  },
  home: {
    title: 'Objects with intent, not noise.',
    description: '',
    images: [],
  },
  about: {
    title: 'Curation is a product decision.',
    description: '',
    images: [],
  },
  contact: {
    title: 'Studio',
    description: '',
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

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: string; message?: string }
  return (
    maybeError.code === 'PGRST205' ||
    (typeof maybeError.message === 'string' &&
      maybeError.message.includes('Could not find the table'))
  )
}

function normalizeContent(raw: ApiContentSettings): ContentSettings {
  return {
    layout: {
      navbarTitle: raw.site_name || defaultContent.layout.navbarTitle,
      footerLeft: raw.footer_left || defaultContent.layout.footerLeft,
      footerRight: raw.footer_right || defaultContent.layout.footerRight,
    },
    theme: {
      primary: raw.theme_primary || defaultContent.theme.primary,
      secondary: raw.theme_secondary || defaultContent.theme.secondary,
      textPrimary: raw.theme_text_primary || defaultContent.theme.textPrimary,
      textSecondary: raw.theme_text_secondary || defaultContent.theme.textSecondary,
      buttonBg: raw.theme_button_bg || defaultContent.theme.buttonBg,
      buttonText: raw.theme_button_text || defaultContent.theme.buttonText,
    },
    home: {
      title: raw.home_title || defaultContent.home.title,
      description: raw.home_description || '',
      images: [],
    },
    about: {
      title: raw.about_title || defaultContent.about.title,
      description: raw.about_description || '',
      images: [],
    },
    contact: {
      title: raw.contact_title || defaultContent.contact.title,
      description: raw.contact_description || '',
      email: raw.contact_email || defaultContent.contact.email,
      mapQuery: raw.contact_map_query || defaultContent.contact.mapQuery,
      phone: raw.contact_phone || '',
      phoneAlt: raw.contact_phone_alt || '',
      facebook: raw.contact_facebook || '',
      instagram: raw.contact_instagram || '',
      line: raw.contact_line || '',
      zoom: typeof raw.contact_zoom === 'number' ? raw.contact_zoom : 14,
    },
  }
}

async function getOrCreateContentSettingsRow(): Promise<ApiContentSettings> {
  const { data, error } = await supabase
    .from('content_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    if (isMissingTableError(error)) {
      return {
        site_name: defaultContent.layout.navbarTitle,
        footer_left: defaultContent.layout.footerLeft,
        footer_right: defaultContent.layout.footerRight,
        theme_primary: defaultContent.theme.primary,
        theme_secondary: defaultContent.theme.secondary,
        theme_text_primary: defaultContent.theme.textPrimary,
        theme_text_secondary: defaultContent.theme.textSecondary,
        theme_button_bg: defaultContent.theme.buttonBg,
        theme_button_text: defaultContent.theme.buttonText,
        home_title: defaultContent.home.title,
        home_description: defaultContent.home.description,
        about_title: defaultContent.about.title,
        about_description: defaultContent.about.description,
        contact_title: defaultContent.contact.title,
        contact_description: defaultContent.contact.description,
        contact_email: defaultContent.contact.email,
        contact_map_query: defaultContent.contact.mapQuery,
        contact_zoom: defaultContent.contact.zoom,
      }
    }
    throw error
  }

  if (data) {
    return data as ApiContentSettings
  }

  const { data: inserted, error: insertError } = await supabase
    .from('content_settings')
    .insert([
      {
        site_name: defaultContent.layout.navbarTitle,
        footer_left: defaultContent.layout.footerLeft,
        footer_right: defaultContent.layout.footerRight,
        theme_primary: defaultContent.theme.primary,
        theme_secondary: defaultContent.theme.secondary,
        theme_text_primary: defaultContent.theme.textPrimary,
        theme_text_secondary: defaultContent.theme.textSecondary,
        theme_button_bg: defaultContent.theme.buttonBg,
        theme_button_text: defaultContent.theme.buttonText,
        home_title: defaultContent.home.title,
        home_description: defaultContent.home.description,
        about_title: defaultContent.about.title,
        about_description: defaultContent.about.description,
        contact_title: defaultContent.contact.title,
        contact_description: defaultContent.contact.description,
        contact_email: defaultContent.contact.email,
        contact_map_query: defaultContent.contact.mapQuery,
        contact_zoom: defaultContent.contact.zoom,
      },
    ])
    .select('*')
    .single()

  if (insertError) {
    throw insertError
  }

  return inserted as ApiContentSettings
}

export async function getContent(): Promise<ContentSettings> {
  const row = await getOrCreateContentSettingsRow()

  const { data: contentImages, error: imagesError } = await supabase
    .from('images')
    .select('id, url, content_section')
    .in('content_section', ['home', 'about'])
    .order('created_at', { ascending: false })

  if (imagesError && !isMissingTableError(imagesError)) {
    throw imagesError
  }

  const normalized = normalizeContent(row)
  const list = contentImages || []

  return {
    ...normalized,
    home: {
      ...normalized.home,
      images: list
        .filter((item) => item.content_section === 'home')
        .map((item) => ({ id: item.id, url: item.url })),
    },
    about: {
      ...normalized.about,
      images: list
        .filter((item) => item.content_section === 'about')
        .map((item) => ({ id: item.id, url: item.url })),
    },
  }
}

export async function updateLayoutContent(data: LayoutContent & { theme: ThemeContent }): Promise<ContentSettings> {
  const row = await getOrCreateContentSettingsRow()
  if (!row.id) return defaultContent

  const { data: result, error } = await supabase
    .from('content_settings')
    .update({
      site_name: data.navbarTitle,
      footer_left: data.footerLeft,
      footer_right: data.footerRight,
      theme_primary: data.theme.primary,
      theme_secondary: data.theme.secondary,
      theme_text_primary: data.theme.textPrimary,
      theme_text_secondary: data.theme.textSecondary,
      theme_button_bg: data.theme.buttonBg,
      theme_button_text: data.theme.buttonText,
    })
    .eq('id', row.id)
    .select()
    .single()
  
  if (error) throw error
  return normalizeContent(result as ApiContentSettings)
}

export async function updateHomeContent(data: HomeContent & { siteName?: string }): Promise<ContentSettings> {
  const row = await getOrCreateContentSettingsRow()
  if (!row.id) return defaultContent

  const { data: result, error } = await supabase
    .from('content_settings')
    .update({
      site_name: data.siteName,
      home_title: data.title,
      home_description: data.description,
    })
    .eq('id', row.id)
    .select()
    .single()
  
  if (error) throw error
  return normalizeContent(result as ApiContentSettings)
}

export async function updateAboutContent(data: AboutContent): Promise<ContentSettings> {
  const row = await getOrCreateContentSettingsRow()
  if (!row.id) return defaultContent

  const { data: result, error } = await supabase
    .from('content_settings')
    .update({
      about_title: data.title,
      about_description: data.description,
    })
    .eq('id', row.id)
    .select()
    .single()
  
  if (error) throw error
  return normalizeContent(result as ApiContentSettings)
}

export async function updateContactContent(data: ContactContent): Promise<ContentSettings> {
  const row = await getOrCreateContentSettingsRow()
  if (!row.id) return defaultContent

  const { data: result, error } = await supabase
    .from('content_settings')
    .update({
      contact_title: data.title,
      contact_description: data.description,
      contact_email: data.email,
      contact_map_query: data.mapQuery,
      contact_phone: data.phone,
      contact_phone_alt: data.phoneAlt,
      contact_facebook: data.facebook,
      contact_instagram: data.instagram,
      contact_line: data.line,
      contact_zoom: data.zoom,
    })
    .eq('id', row.id)
    .select()
    .single()
  
  if (error) throw error
  return normalizeContent(result as ApiContentSettings)
}
