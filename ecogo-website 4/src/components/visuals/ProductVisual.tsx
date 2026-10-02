import type { ReactNode } from 'react'
import type { Product } from '@/lib/types'

/**
 * Product artwork. Each product can supply a hosted `image_url` (real photography, when available)
 * or a `visual_key` that picks one of the illustrations below. To add a new illustration:
 * write a small component, register it in `illustrations`, and use its key in the products table.
 */

function Frame({ bg, label, children }: { bg: string; label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={bg} />
      {children}
    </svg>
  )
}

const ink = '#0b2140'
const green = '#419225'
const amber = '#f5a70a'

function SolarLamp({ label }: { label: string }) {
  return (
    <Frame bg="#ffeab5" label={label}>
      {/* sun */}
      <g transform="translate(322 74)">
        <circle r="26" fill={amber} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="-3" y="-50" width="6" height="14" rx="3" fill={amber} transform={`rotate(${i * 45})`} />
        ))}
      </g>
      {/* light cast by the lamp */}
      <path d="M170 168 L92 262 H248 L170 168Z" fill="#fff6d8" />
      {/* ground */}
      <rect x="0" y="252" width="400" height="48" fill="#f3d98c" />
      {/* pole */}
      <rect x="164" y="116" width="12" height="140" rx="4" fill={ink} />
      {/* solar panel */}
      <path d="M116 100 L232 100 L214 58 L134 58 Z" fill={ink} />
      <path d="M156 58 L150 100 M194 58 L190 100 M124 79 H224" stroke="#3d5a86" strokeWidth="2.5" />
      {/* lamp head */}
      <path d="M140 116 H200 L188 160 H152 Z" fill={ink} />
      <ellipse cx="170" cy="162" rx="20" ry="7" fill="#fff6d8" />
    </Frame>
  )
}

function Camera({ label }: { label: string }) {
  return (
    <Frame bg="#d1dceb" label={label}>
      {/* wall */}
      <rect x="0" y="0" width="120" height="300" fill="#1a4680" />
      {/* field of view */}
      <path d="M262 132 L392 60 V232 Z" fill="#ffffff" opacity="0.45" />
      {/* bracket */}
      <rect x="110" y="120" width="60" height="14" rx="7" fill={ink} />
      <rect x="96" y="100" width="16" height="54" rx="6" fill={ink} />
      {/* body */}
      <g transform="rotate(-6 210 132)">
        <rect x="150" y="98" width="130" height="68" rx="20" fill={ink} />
        <rect x="150" y="98" width="130" height="20" rx="10" fill="#12305c" />
        <circle cx="262" cy="132" r="26" fill="#3d5a86" />
        <circle cx="262" cy="132" r="17" fill={ink} />
        <circle cx="262" cy="132" r="7" fill="#78c957" />
        <circle cx="176" cy="142" r="5" fill={green} />
      </g>
      {/* ground line */}
      <rect x="0" y="262" width="400" height="38" fill="#aebfd6" />
    </Frame>
  )
}

function MemoryCard({ label }: { label: string }) {
  return (
    <Frame bg="#e5edf6" label={label}>
      {/* SD card */}
      <g transform="rotate(-8 190 150)">
        <path d="M110 60 H232 L276 104 V236 a12 12 0 0 1 -12 12 H122 a12 12 0 0 1 -12 -12 Z" fill={ink} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={126 + i * 18} y="66" width="10" height="34" rx="3" fill={amber} />
        ))}
        <rect x="132" y="138" width="110" height="60" rx="10" fill="#f6f9fc" />
        <rect x="146" y="154" width="54" height="8" rx="4" fill={ink} />
        <rect x="146" y="172" width="34" height="8" rx="4" fill={green} />
        <rect x="246" y="150" width="8" height="30" rx="4" fill="#3d5a86" />
      </g>
      {/* microSD */}
      <g transform="rotate(10 300 196)">
        <path d="M270 150 H322 V212 a8 8 0 0 1 -8 8 H278 a8 8 0 0 1 -8 -8 Z" fill={green} />
        <path d="M322 150 V212 a8 8 0 0 1 -8 8" fill="none" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={278 + i * 12} y="196" width="8" height="18" rx="2" fill="#f6f9fc" />
        ))}
      </g>
    </Frame>
  )
}

function PowerBank({ label }: { label: string }) {
  return (
    <Frame bg={ink} label={label}>
      {/* cable */}
      <path d="M212 236 C 268 262, 292 214, 316 190" fill="none" stroke="#78c957" strokeWidth="6" strokeLinecap="round" />
      {/* phone */}
      <g transform="rotate(10 318 150)">
        <rect x="286" y="60" width="66" height="128" rx="14" fill="#12305c" stroke="#f6f9fc" strokeWidth="4" />
        <rect x="298" y="104" width="42" height="16" rx="4" fill="none" stroke="#f6f9fc" strokeWidth="2.5" />
        <rect x="301" y="107" width="12" height="10" rx="2" fill={amber} />
        <rect x="315" y="107" width="12" height="10" rx="2" fill="#78c957" opacity="0.45" />
      </g>
      {/* bank */}
      <rect x="64" y="70" width="152" height="186" rx="26" fill="#f6f9fc" />
      <rect x="64" y="70" width="152" height="46" rx="26" fill="#e5edf6" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={84 + i * 32} y="86" width="24" height="14" rx="5" fill={i < 3 ? green : '#aebfd6'} />
      ))}
      <path d="M144 146 116 196h22l-8 42 40-56h-24l14-36Z" fill={ink} />
    </Frame>
  )
}

function Generic({ label }: { label: string }) {
  return (
    <Frame bg="#e5edf6" label={label}>
      <path d="M200 90 280 132v72l-80 42-80-42v-72L200 90Z" fill="none" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <path d="M120 132 200 174 280 132M200 174v72" fill="none" stroke={ink} strokeWidth="6" strokeLinejoin="round" />
    </Frame>
  )
}

const illustrations: Record<string, (p: { label: string }) => ReactNode> = {
  'solar-lamp': SolarLamp,
  camera: Camera,
  'memory-card': MemoryCard,
  'power-bank': PowerBank,
}

export function ProductVisual({ product, className = '' }: { product: Pick<Product, 'name' | 'visualKey' | 'imageUrl'>; className?: string }) {
  const label = `Illustration of ${product.name.toLowerCase()}`
  if (product.imageUrl) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
    )
  }
  const Art = (product.visualKey && illustrations[product.visualKey]) || Generic
  return (
    <div className={`overflow-hidden ${className}`}>
      <Art label={label} />
    </div>
  )
}
