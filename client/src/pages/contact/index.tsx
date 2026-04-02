import type { FormEvent } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useContentSettings } from '@/features/content/content-store'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is invalid'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export function ContactPage() {
  const content = useContentSettings()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
    }

    const parsed = contactSchema.safeParse(payload)
    if (!parsed.success) {
      window.alert(parsed.error.issues[0]?.message ?? 'Invalid input')
      return
    }

    const subject = encodeURIComponent(`Contact from ${parsed.data.name}`)
    const body = encodeURIComponent(
      `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    )

    window.location.href = `mailto:${content.contact.email}?subject=${subject}&body=${body}`
    event.currentTarget.reset()
  }

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(content.contact.mapQuery || 'Q8MV+GJ Pak Trae, Ranot District, Songkhla')}&output=embed`

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <div className="rounded-3xl border border-ink/10 bg-white/90 p-7 shadow-soft">
        <p className="text-xs uppercase tracking-[0.25em] text-brass">Contect</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-ink">{content.contact.title}</h1>
        <p className="mt-3 max-w-3xl text-base text-ink/70">{content.contact.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-ink">Send us a message</p>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Name</p>
            <Input name="name" placeholder="Name" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Email</p>
            <Input name="email" type="email" placeholder="Email" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Message</p>
            <Textarea name="message" placeholder="Message" className="min-h-36" />
          </div>
          <Button type="submit">Send Message</Button>

          <div className="grid gap-3 border-t border-ink/10 pt-4 text-sm text-ink/70 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brass">Email</p>
              <a className="mt-1 block break-all underline-offset-4 hover:underline" href={`mailto:${content.contact.email}`}>
                {content.contact.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brass">Phone 1</p>
              <p className="mt-1 break-all">{content.contact.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brass">Phone 2</p>
              <p className="mt-1 break-all">{content.contact.phoneAlt || '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brass">Facebook</p>
              <p className="mt-1 break-all">{content.contact.facebook || '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brass">Instagram</p>
              <p className="mt-1 break-all">{content.contact.instagram || '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brass">Line</p>
              <p className="mt-1 break-all">{content.contact.line || '-'}</p>
            </div>
          </div>
        </form>

        <aside className="space-y-4 rounded-2xl border border-ink/10 bg-white/80 p-4 shadow-soft">
          <iframe
            title="Location map"
            src={mapUrl}
            className="h-[420px] w-full rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="rounded-xl border border-ink/10 bg-parchment/40 p-3 text-sm text-ink/70">
            <p className="text-xs uppercase tracking-[0.2em] text-brass">Map Query</p>
            <p className="mt-1 break-words">{content.contact.mapQuery || 'Q8MV+GJ Pak Trae, Ranot District, Songkhla'}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
