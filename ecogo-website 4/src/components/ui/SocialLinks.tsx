import { company } from '@/content/site'
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './Icons'
import { whatsappLink, defaultWhatsappMessage } from '@/content/site'

interface Props {
  tone?: 'light' | 'dark'
  className?: string
}

/** Social profile and WhatsApp icons. An icon only appears once its address is filled in, in src/content/site.ts. */
export function SocialLinks({ tone = 'light', className = '' }: Props) {
  const items = [
    { label: 'Ecogo on WhatsApp', href: whatsappLink(defaultWhatsappMessage), Icon: WhatsAppIcon },
    { label: 'Ecogo on Instagram', href: company.social.instagram, Icon: InstagramIcon },
    { label: 'Ecogo on Facebook', href: company.social.facebook, Icon: FacebookIcon },
    { label: 'Ecogo on TikTok', href: company.social.tiktok, Icon: TikTokIcon },
  ].filter((i): i is { label: string; href: string; Icon: typeof WhatsAppIcon } => !!i.href)

  if (items.length === 0) return null
  const cls =
    tone === 'dark'
      ? 'border-white/30 text-white hover:bg-white hover:text-ink-900'
      : 'border-mist-400 text-ink-900 hover:bg-brand-blue hover:border-brand-blue hover:text-white'

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`} aria-label="Ecogo on social media">
      {items.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`inline-flex size-12 items-center justify-center rounded-full border-2 transition-colors ${cls}`}
          >
            <Icon width={24} height={24} />
          </a>
        </li>
      ))}
    </ul>
  )
}
