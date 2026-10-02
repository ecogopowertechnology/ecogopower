import { useSearchParams } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { company, contactReasons, defaultWhatsappMessage, isPlaceholder, whatsappLink, type ContactReason } from '@/content/site'
import { fallbackProducts } from '@/content/products'
import { Container } from '@/components/ui/Container'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { Button } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { ContactForm } from '@/components/forms/ContactForm'
import { Detail } from '@/components/layout/Footer'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/Icons'

const validReasons = new Set<string>(contactReasons.map((r) => r.value))

export default function Contact() {
  usePageMeta({
    title: 'Contact Ecogo',
    description:
      'Get in touch with Ecogo in Nairobi about solar products, electronics, sourcing, or hosting and partnering on the shared power bank project.',
    path: '/contact',
  })
  const [params] = useSearchParams()

  const reasonParam = params.get('reason') ?? ''
  const reason: ContactReason = validReasons.has(reasonParam) ? (reasonParam as ContactReason) : 'general'
  const product = fallbackProducts.find((p) => p.slug === params.get('product'))
  const message = product ? `I would like to know more about: ${product.name}.\n\n` : ''

  const rows = [
    { icon: MailIcon, label: 'Email', value: company.email, href: `mailto:${company.email}` },
    { icon: PhoneIcon, label: 'Phone', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
    { icon: PinIcon, label: 'Address', value: company.address },
    { icon: ClockIcon, label: 'Hours', value: company.hours },
  ]

  return (
    <Container className="pb-24 pt-14 md:pb-32 md:pt-24">
      <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <h1 id="contact-title" className="t-h1">
            Contact us
          </h1>
          <p className="t-lead mt-8 max-w-[38ch] text-slate-ink">
            Ask about a product, sourcing, or the shared power bank project.
          </p>

          <dl className="mt-10 space-y-6">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-mist-200">
                  <r.icon width={22} height={22} />
                </span>
                <div>
                  <dt className="text-sm text-slate-ink">{r.label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold">
                    {isPlaceholder(r.value) || !r.href ? (
                      <Detail value={r.value} />
                    ) : (
                      <a href={r.href} className="underline underline-offset-4 hover:text-charge-700">
                        {r.value}
                      </a>
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          {whatsappLink(defaultWhatsappMessage) && (
            <Button href={whatsappLink(defaultWhatsappMessage)!} external className="mt-8">
              <WhatsAppIcon className="mr-2.5" width={22} height={22} />
              Chat on WhatsApp
            </Button>
          )}
          <SocialLinks className="mt-6" />
        </div>

        <div className="rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-mist-300 sm:p-10">
          {/* key forces the form to reset when the visitor arrives from a different prefilled link */}
          <ContactForm key={`${reason}-${product?.slug ?? ''}`} initialReason={reason} initialMessage={message} />
        </div>
      </div>
    </Container>
  )
}
