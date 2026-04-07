import { useEffect, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useContentSettings } from '@/features/content/content-store'
import { useUpdateHomeContent } from '@/features/content/hooks/use-update-home-content'
import { useUpdateAboutContent } from '@/features/content/hooks/use-update-about-content'
import { useUpdateContactContent } from '@/features/content/hooks/use-update-contact-content'
import { useUploadHomeImages } from '@/features/content/hooks/use-upload-home-images'
import { useUploadAboutImages } from '@/features/content/hooks/use-upload-about-images'
import { useDeleteHomeImage } from '@/features/content/hooks/use-delete-home-image'
import { useDeleteAboutImage } from '@/features/content/hooks/use-delete-about-image'
import { useUpdateLayoutContent } from '@/features/content/hooks/use-update-layout-content'
import type { ContentImage } from '@/features/content/types'
import { resolveImageUrl } from '@/lib/utils'

const HOME_IMAGE_MAX = 5
const ABOUT_IMAGE_MAX = 20
const NAME_MAX = 30
const DESCRIPTION_MAX = 200
const DEFAULT_MAP_QUERY = 'Q8MV+GJ Pak Trae, Ranot District, Songkhla'
const FOOTER_MAX = 120

type FilePickerProps = {
  id: string
  selectedCount: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function FilePicker({ id, selectedCount, onChange }: FilePickerProps) {
  return (
    <div className="space-y-2">
      <input id={id} type="file" multiple accept="image/*" className="hidden" onChange={onChange} />
      <label
        htmlFor={id}
        className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-brass/50 bg-brass/10 px-4 text-sm font-semibold text-brass transition hover:bg-brass/20"
      >
        Choose images
      </label>
      <p className="text-xs text-ink/60">Selected {selectedCount} image(s)</p>
    </div>
  )
}

function ImageGrid({
  images,
  onDelete,
  emptyLabel,
}: {
  images: ContentImage[]
  onDelete: (image: ContentImage) => void
  emptyLabel: string
}) {
  if (images.length === 0) {
    return <p className="text-sm text-ink/60">{emptyLabel}</p>
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => (
        <div key={image.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-soft">
          <img src={resolveImageUrl(image.url)} alt="content" className="h-36 w-full rounded-xl object-cover" />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="truncate text-xs text-ink/50">ID: {image.id}</span>
            <Button type="button" className="h-8 bg-red-600 text-white hover:bg-red-700" onClick={() => onDelete(image)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminContentPanel() {
  const content = useContentSettings()
  const updateLayout = useUpdateLayoutContent()
  const updateHome = useUpdateHomeContent()
  const updateAbout = useUpdateAboutContent()
  const updateContact = useUpdateContactContent()
  const uploadHomeImages = useUploadHomeImages()
  const uploadAboutImages = useUploadAboutImages()
  const deleteHomeImage = useDeleteHomeImage()
  const deleteAboutImage = useDeleteAboutImage()

  const [activeTab, setActiveTab] = useState<'layout' | 'home' | 'about' | 'contact'>('layout')
  const [siteName, setSiteName] = useState(content.layout.navbarTitle)
  const [footerLeft, setFooterLeft] = useState(content.layout.footerLeft)
  const [footerRight, setFooterRight] = useState(content.layout.footerRight)
  const [themePrimary, setThemePrimary] = useState(content.theme.primary)
  const [themeSecondary, setThemeSecondary] = useState(content.theme.secondary)
  const [themeTextPrimary, setThemeTextPrimary] = useState(content.theme.textPrimary)
  const [themeTextSecondary, setThemeTextSecondary] = useState(content.theme.textSecondary)
  const [themeButtonBg, setThemeButtonBg] = useState(content.theme.buttonBg)
  const [themeButtonText, setThemeButtonText] = useState(content.theme.buttonText)

  const [homeTitle, setHomeTitle] = useState(content.home.title)
  const [homeDescription, setHomeDescription] = useState(content.home.description)
  const [homeImages, setHomeImages] = useState<ContentImage[]>(content.home.images)
  const [homeFiles, setHomeFiles] = useState<File[]>([])

  const [aboutTitle, setAboutTitle] = useState(content.about.title)
  const [aboutDescription, setAboutDescription] = useState(content.about.description)
  const [aboutImages, setAboutImages] = useState<ContentImage[]>(content.about.images)
  const [aboutFiles, setAboutFiles] = useState<File[]>([])

  const [contactTitle, setContactTitle] = useState(content.contact.title)
  const [contactDescription, setContactDescription] = useState(content.contact.description)
  const [contactMapQuery, setContactMapQuery] = useState(content.contact.mapQuery || DEFAULT_MAP_QUERY)
  const [contactEmail, setContactEmail] = useState(content.contact.email)
  const [contactPhone, setContactPhone] = useState(content.contact.phone)
  const [contactPhoneAlt, setContactPhoneAlt] = useState(content.contact.phoneAlt)
  const [contactFacebook, setContactFacebook] = useState(content.contact.facebook)
  const [contactInstagram, setContactInstagram] = useState(content.contact.instagram)
  const [contactLine, setContactLine] = useState(content.contact.line)
  const [contactZoom, setContactZoom] = useState(String(content.contact.zoom))

  useEffect(() => {
    setSiteName(content.layout.navbarTitle)
    setFooterLeft(content.layout.footerLeft)
    setFooterRight(content.layout.footerRight)
    setThemePrimary(content.theme.primary)
    setThemeSecondary(content.theme.secondary)
    setThemeTextPrimary(content.theme.textPrimary)
    setThemeTextSecondary(content.theme.textSecondary)
    setThemeButtonBg(content.theme.buttonBg)
    setThemeButtonText(content.theme.buttonText)
    setHomeTitle(content.home.title)
    setHomeDescription(content.home.description)
    setHomeImages(content.home.images)

    setAboutTitle(content.about.title)
    setAboutDescription(content.about.description)
    setAboutImages(content.about.images)

    setContactTitle(content.contact.title)
    setContactDescription(content.contact.description)
    setContactMapQuery(content.contact.mapQuery || DEFAULT_MAP_QUERY)
    setContactEmail(content.contact.email)
    setContactPhone(content.contact.phone)
    setContactPhoneAlt(content.contact.phoneAlt)
    setContactFacebook(content.contact.facebook)
    setContactInstagram(content.contact.instagram)
    setContactLine(content.contact.line)
    setContactZoom(String(content.contact.zoom))
  }, [content])

  const saveLayout = async () => {
    if (siteName.trim().length === 0 || siteName.trim().length > 50) {
      window.alert('Navbar title must be 1-50 characters.')
      return
    }
    if (footerLeft.trim().length === 0 || footerLeft.trim().length > FOOTER_MAX) {
      window.alert(`Footer left must be 1-${FOOTER_MAX} characters.`)
      return
    }
    if (footerRight.trim().length === 0 || footerRight.trim().length > FOOTER_MAX) {
      window.alert(`Footer right must be 1-${FOOTER_MAX} characters.`)
      return
    }

    const hexColor = /^#([0-9a-fA-F]{6})$/
    if (!hexColor.test(themePrimary) || !hexColor.test(themeSecondary) || !hexColor.test(themeTextPrimary) || !hexColor.test(themeTextSecondary) || !hexColor.test(themeButtonBg) || !hexColor.test(themeButtonText)) {
      window.alert('Theme colors must be HEX format, for example: #705D00')
      return
    }

    await updateLayout.mutateAsync({
      navbarTitle: siteName.trim(),
      footerLeft: footerLeft.trim(),
      footerRight: footerRight.trim(),
      theme: {
        primary: themePrimary,
        secondary: themeSecondary,
        textPrimary: themeTextPrimary,
        textSecondary: themeTextSecondary,
        buttonBg: themeButtonBg,
        buttonText: themeButtonText,
      },
    })
  }

  const resetHome = () => {
    setHomeTitle(content.home.title)
    setHomeDescription(content.home.description)
    setHomeImages(content.home.images)
    setHomeFiles([])
  }

  const resetAbout = () => {
    setAboutTitle(content.about.title)
    setAboutDescription(content.about.description)
    setAboutImages(content.about.images)
    setAboutFiles([])
  }

  const saveHome = async () => {
    if (homeTitle.trim().length === 0 || homeTitle.trim().length > NAME_MAX) {
      window.alert(`Home title must be 1-${NAME_MAX} characters.`)
      return
    }

    if (homeDescription.trim().length > DESCRIPTION_MAX) {
      window.alert(`Home description must be at most ${DESCRIPTION_MAX} characters.`)
      return
    }

    if (homeImages.length + homeFiles.length > HOME_IMAGE_MAX) {
      window.alert(`Home images must not exceed ${HOME_IMAGE_MAX}.`)
      return
    }

    await updateHome.mutateAsync({
      title: homeTitle.trim(),
      description: homeDescription.trim(),
      images: homeImages,
    })

    if (homeFiles.length > 0) {
      await uploadHomeImages.mutateAsync(homeFiles)
    }

    setHomeFiles([])
  }

  const saveAbout = async () => {
    if (aboutTitle.trim().length === 0 || aboutTitle.trim().length > NAME_MAX) {
      window.alert(`About title must be 1-${NAME_MAX} characters.`)
      return
    }

    if (aboutDescription.trim().length > DESCRIPTION_MAX) {
      window.alert(`About description must be at most ${DESCRIPTION_MAX} characters.`)
      return
    }

    if (aboutImages.length + aboutFiles.length > ABOUT_IMAGE_MAX) {
      window.alert(`About images must not exceed ${ABOUT_IMAGE_MAX}.`)
      return
    }

    await updateAbout.mutateAsync({
      title: aboutTitle.trim(),
      description: aboutDescription.trim(),
      images: aboutImages,
    })

    if (aboutFiles.length > 0) {
      await uploadAboutImages.mutateAsync(aboutFiles)
    }

    setAboutFiles([])
  }

  const saveContact = async () => {
    if (contactTitle.trim().length === 0 || contactTitle.trim().length > NAME_MAX) {
      window.alert(`Contact title must be 1-${NAME_MAX} characters.`)
      return
    }

    if (contactDescription.trim().length > DESCRIPTION_MAX) {
      window.alert(`Contact description must be at most ${DESCRIPTION_MAX} characters.`)
      return
    }

    const zoom = Number(contactZoom)
    if (Number.isNaN(zoom)) {
      window.alert('Zoom must be numeric.')
      return
    }

    await updateContact.mutateAsync({
      title: contactTitle.trim(),
      description: contactDescription.trim(),
      mapQuery: contactMapQuery.trim() || DEFAULT_MAP_QUERY,
      email: contactEmail.trim(),
      phone: contactPhone.trim(),
      phoneAlt: contactPhoneAlt.trim(),
      facebook: contactFacebook.trim(),
      instagram: contactInstagram.trim(),
      line: contactLine.trim(),
      zoom,
    })
  }

  const removeHomeImage = async (image: ContentImage) => {
    if (!window.confirm('Delete this image?')) {
      return
    }

    await deleteHomeImage.mutateAsync(image.id)
  }

  const removeAboutImage = async (image: ContentImage) => {
    if (!window.confirm('Delete this image?')) {
      return
    }

    await deleteAboutImage.mutateAsync(image.id)
  }

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(contactMapQuery || DEFAULT_MAP_QUERY)}&output=embed`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button type="button" className={activeTab === 'layout' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'} onClick={() => setActiveTab('layout')}>
          Layout menu
        </Button>
        <Button type="button" className={activeTab === 'home' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'} onClick={() => setActiveTab('home')}>
          Home
        </Button>
        <Button type="button" className={activeTab === 'about' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'} onClick={() => setActiveTab('about')}>
          About us
        </Button>
        <Button type="button" className={activeTab === 'contact' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'} onClick={() => setActiveTab('contact')}>
          Contect
        </Button>
      </div>

      {activeTab === 'layout' ? (
        <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
          <h2 className="font-display text-2xl font-bold">Layout menu</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Navbar title</p>
              <Input value={siteName} maxLength={50} onChange={(event) => setSiteName(event.target.value)} placeholder="shopname" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Footer left</p>
              <Input value={footerLeft} maxLength={FOOTER_MAX} onChange={(event) => setFooterLeft(event.target.value)} placeholder="Curating with intent since 2026." />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Footer right</p>
              <Input value={footerRight} maxLength={FOOTER_MAX} onChange={(event) => setFooterRight(event.target.value)} placeholder="shopname" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">สีหลัก</p>
              <div className="flex gap-2">
                <Input value={themePrimary} maxLength={7} onChange={(event) => setThemePrimary(event.target.value)} placeholder="#705D00" />
                <input type="color" value={themePrimary} onChange={(event) => setThemePrimary(event.target.value)} className="h-11 w-14 rounded-xl border border-ink/15 bg-white p-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">สีรอง</p>
              <div className="flex gap-2">
                <Input value={themeSecondary} maxLength={7} onChange={(event) => setThemeSecondary(event.target.value)} placeholder="#E8E2D9" />
                <input type="color" value={themeSecondary} onChange={(event) => setThemeSecondary(event.target.value)} className="h-11 w-14 rounded-xl border border-ink/15 bg-white p-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">สีตัวอักษรหลัก</p>
              <div className="flex gap-2">
                <Input value={themeTextPrimary} maxLength={7} onChange={(event) => setThemeTextPrimary(event.target.value)} placeholder="#2D3339" />
                <input type="color" value={themeTextPrimary} onChange={(event) => setThemeTextPrimary(event.target.value)} className="h-11 w-14 rounded-xl border border-ink/15 bg-white p-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">สีตัวอักษรรอง</p>
              <div className="flex gap-2">
                <Input value={themeTextSecondary} maxLength={7} onChange={(event) => setThemeTextSecondary(event.target.value)} placeholder="#596066" />
                <input type="color" value={themeTextSecondary} onChange={(event) => setThemeTextSecondary(event.target.value)} className="h-11 w-14 rounded-xl border border-ink/15 bg-white p-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">สีพื้นปุ่ม</p>
              <div className="flex gap-2">
                <Input value={themeButtonBg} maxLength={7} onChange={(event) => setThemeButtonBg(event.target.value)} placeholder="#705D00" />
                <input type="color" value={themeButtonBg} onChange={(event) => setThemeButtonBg(event.target.value)} className="h-11 w-14 rounded-xl border border-ink/15 bg-white p-1" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">สีตัวอักษรบนปุ่ม</p>
              <div className="flex gap-2">
                <Input value={themeButtonText} maxLength={7} onChange={(event) => setThemeButtonText(event.target.value)} placeholder="#FFFFFF" />
                <input type="color" value={themeButtonText} onChange={(event) => setThemeButtonText(event.target.value)} className="h-11 w-14 rounded-xl border border-ink/15 bg-white p-1" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={saveLayout}>Save Layout</Button>
          </div>
        </Card>
      ) : null}

      {activeTab === 'home' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <h2 className="font-display text-2xl font-bold">Home content</h2>
            <div className="space-y-3">
              <Input value={homeTitle} maxLength={NAME_MAX} onChange={(event) => setHomeTitle(event.target.value)} placeholder="Title" />
              <Textarea value={homeDescription} maxLength={DESCRIPTION_MAX} onChange={(event) => setHomeDescription(event.target.value)} placeholder="Description" className="min-h-32" />
              <FilePicker id="home-content-images" selectedCount={homeFiles.length} onChange={(event) => setHomeFiles(Array.from(event.target.files || []).slice(0, HOME_IMAGE_MAX - homeImages.length))} />
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={saveHome}>Save Home</Button>
              <Button type="button" variant="outline" onClick={resetHome}>Reset</Button>
            </div>
          </Card>

          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold">Home images</h2>
              <p className="text-xs text-ink/60">Auto slideshow every 2 sec on homepage</p>
            </div>
            <ImageGrid images={homeImages} onDelete={removeHomeImage} emptyLabel={`No images yet. Max ${HOME_IMAGE_MAX} images.`} />
          </Card>
        </div>
      ) : null}

      {activeTab === 'about' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <h2 className="font-display text-2xl font-bold">About us content</h2>
            <div className="space-y-3">
              <Input value={aboutTitle} maxLength={NAME_MAX} onChange={(event) => setAboutTitle(event.target.value)} placeholder="Title" />
              <Textarea value={aboutDescription} maxLength={DESCRIPTION_MAX} onChange={(event) => setAboutDescription(event.target.value)} placeholder="Description" className="min-h-32" />
              <FilePicker id="about-content-images" selectedCount={aboutFiles.length} onChange={(event) => setAboutFiles(Array.from(event.target.files || []).slice(0, ABOUT_IMAGE_MAX - aboutImages.length))} />
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={saveAbout}>Save About</Button>
              <Button type="button" variant="outline" onClick={resetAbout}>Reset</Button>
            </div>
          </Card>

          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <h2 className="font-display text-2xl font-bold">About images</h2>
            <ImageGrid images={aboutImages} onDelete={removeAboutImage} emptyLabel={`No images yet. Max ${ABOUT_IMAGE_MAX} images.`} />
          </Card>
        </div>
      ) : null}

      {activeTab === 'contact' ? (
        <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
          <h2 className="font-display text-2xl font-bold">Contect content</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Title</p>
              <Input value={contactTitle} maxLength={NAME_MAX} onChange={(event) => setContactTitle(event.target.value)} placeholder="Studio" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Email</p>
              <Input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="Email" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Phone 1</p>
              <Input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="Phone 1" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Phone 2</p>
              <Input value={contactPhoneAlt} onChange={(event) => setContactPhoneAlt(event.target.value)} placeholder="Phone 2" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Facebook</p>
              <Input value={contactFacebook} onChange={(event) => setContactFacebook(event.target.value)} placeholder="Facebook" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Instagram</p>
              <Input value={contactInstagram} onChange={(event) => setContactInstagram(event.target.value)} placeholder="Instagram" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Line</p>
              <Input value={contactLine} onChange={(event) => setContactLine(event.target.value)} placeholder="Line" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Google map query</p>
              <Input value={contactMapQuery} onChange={(event) => setContactMapQuery(event.target.value)} placeholder="Q8MV+GJ Pak Trae, Ranot District, Songkhla" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Description</p>
              <Textarea value={contactDescription} maxLength={DESCRIPTION_MAX} onChange={(event) => setContactDescription(event.target.value)} placeholder="Description" className="min-h-32" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Map zoom</p>
              <Input value={contactZoom} onChange={(event) => setContactZoom(event.target.value)} placeholder="Zoom" />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
            <div className="flex gap-2">
              <Button type="button" onClick={saveContact}>Save Contact</Button>
            </div>
            <iframe
              title="Location map preview"
              src={mapUrl}
              className="h-72 w-full rounded-2xl border border-ink/10"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Card>
      ) : null}
    </div>
  )
}
