export type ContentImage = {
  id: string
  url: string
}

export type LayoutContent = {
  navbarTitle: string
  footerLeft: string
  footerRight: string
}

export type ThemeContent = {
  primary: string
  secondary: string
  textPrimary: string
  textSecondary: string
  buttonBg: string
  buttonText: string
}

export type HomeContent = {
  title: string
  description: string
  images: ContentImage[]
}

export type AboutContent = {
  title: string
  description: string
  images: ContentImage[]
}

export type ContactContent = {
  title: string
  description: string
  email: string
  mapQuery: string
  phone: string
  phoneAlt: string
  facebook: string
  instagram: string
  line: string
  zoom: number
}

export type ContentSettings = {
  layout: LayoutContent
  theme: ThemeContent
  home: HomeContent
  about: AboutContent
  contact: ContactContent
}
