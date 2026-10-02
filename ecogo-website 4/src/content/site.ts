/**
 * Central place for company details and site-wide copy.
 *
 * Anything in [square brackets] is a PLACEHOLDER. Replace it with the real value
 * and it updates everywhere. Search the project for "[Ecogo" to find them all.
 * Items set to `null` are hidden from the page until you fill them in.
 */

export const company = {
  name: 'Ecogo',
  legalName: 'Ecogo Power Technology Limited',
  tagline: 'Practical power and technology for everyday Kenya',
  city: 'Nairobi',
  country: 'Kenya',

  // While a value is still a placeholder (starts with "["), the contact page shows it
  // as an obvious to-do rather than pretending it is real.
  phone: '+254 757 916 319',
  whatsapp: '254757916319' as string | null, // digits only, with country code
  email: 'ecogopowertechnology@gmail.com',
  address: 'K26 Mall, Kangundo Road, Nairobi',
  hours: 'Sunday to Friday, 9:00 to 20:00',

  // Full profile addresses. Set a value to null to hide that icon.
  social: {
    instagram: 'https://www.instagram.com/ecogopower' as string | null,
    tiktok: 'https://www.tiktok.com/@eco.go.power.tech' as string | null,
    facebook: null as string | null, // paste the full address of the "Eco Go" Facebook page here
  },
}

/** Link that opens a WhatsApp chat with Ecogo, optionally with a message already typed. */
export function whatsappLink(message?: string): string | null {
  if (!company.whatsapp) return null
  return `https://wa.me/${company.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export const defaultWhatsappMessage = 'Hello Ecogo, I would like to ask about your products.'

export const isPlaceholder = (value: string | null | undefined): boolean =>
  !value || value.trim().startsWith('[')

export const nav = [
  { to: '/solutions', label: 'Solutions' },
  { to: '/power-bank', label: 'Power bank project' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

/** Reasons offered in the contact form. Values must match the check constraint in the database. */
export const contactReasons = [
  { value: 'general', label: 'General enquiry' },
  { value: 'products', label: 'Products and solutions' },
  { value: 'sourcing', label: 'Sourcing and procurement' },
  { value: 'powerbank_host', label: 'Host power bank stations at my business' },
  { value: 'powerbank_partner', label: 'Partner or invest in the power bank project' },
  { value: 'other', label: 'Something else' },
] as const

export type ContactReason = (typeof contactReasons)[number]['value']
