import { useLocation } from 'react-router-dom'
import { defaultWhatsappMessage, whatsappLink } from '@/content/site'
import { WhatsAppIcon } from '@/components/ui/Icons'

/** Floating "chat on WhatsApp" button, shown on every public page. */
export function WhatsAppButton() {
  const { pathname } = useLocation()
  const href = whatsappLink(defaultWhatsappMessage)
  if (!href || pathname.startsWith('/admin')) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ecogo on WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-[#25d366] px-4 font-semibold text-[#06301a] shadow-[0_6px_20px_rgba(7,26,53,0.28)] transition-transform hover:scale-105 sm:px-5"
    >
      <WhatsAppIcon width={28} height={28} />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  )
}
