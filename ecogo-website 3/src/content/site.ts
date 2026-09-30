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
  whatsapp: null as string | null, // e.g. '254700000000' (digits only, with country code)
  email: 'ecogopowertechnology@gmail.com',
  address: 'K26 Mall, Kangundo Road, Nairobi',
  hours: 'Sunday to Friday, 9:00 to 20:00',

  social: {
    linkedin: null as string | null, // full URL
    instagram: null as string | null,
    facebook: null as string | null,
    x: null as string | null,
  },
}

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
