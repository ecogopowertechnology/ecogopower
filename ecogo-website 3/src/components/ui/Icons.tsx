import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const BoltIcon = (p: P) => (
  <Icon {...p}><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" /></Icon>
)
export const SunIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </Icon>
)
export const BoxIcon = (p: P) => (
  <Icon {...p}>
    <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
  </Icon>
)
export const PinIcon = (p: P) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Icon>
)
export const PhoneIcon = (p: P) => (
  <Icon {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
    <path d="M11 18.5h2" />
  </Icon>
)
export const StoreIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5V20h16V9.5" />
    <path d="M9.5 20v-5h5v5" />
  </Icon>
)
export const ClockIcon = (p: P) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
)
export const StepsIcon = (p: P) => (
  <Icon {...p}><path d="M4 20h5v-5h5v-5h6M4 20V4" /></Icon>
)
export const HomeIcon = (p: P) => (
  <Icon {...p}><path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5" /></Icon>
)
export const CheckIcon = (p: P) => (
  <Icon {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>
)
export const MailIcon = (p: P) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></Icon>
)
export const MenuIcon = (p: P) => (
  <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
)
export const CloseIcon = (p: P) => (
  <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>
)
export const AlertIcon = (p: P) => (
  <Icon {...p}><path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" /><path d="M12 10v4.2M12 17.2v.1" /></Icon>
)
export const HandshakeIcon = (p: P) => (
  <Icon {...p}>
    <path d="M2.5 11.5 7 7l4 1.5 3-1.5 4 3.5-6 6.5-2.2-1.3M2.5 11.5l4 4M14 7l6.5 4.5M9 16.5l-1.5 1.5" />
  </Icon>
)
