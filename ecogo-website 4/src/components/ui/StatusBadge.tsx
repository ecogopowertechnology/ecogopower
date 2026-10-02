import type { ProductStatus } from '@/lib/types'

const productStatus: Record<ProductStatus, { label: string; cls: string }> = {
  available: { label: 'Available now', cls: 'bg-charge-400/25 text-ink-900' },
  out_of_stock: { label: 'Out of stock', cls: 'bg-mist-300 text-ink-900' },
  coming_soon: { label: 'Coming soon', cls: 'bg-volt-400/40 text-ink-900' },
  in_development: { label: 'In development', cls: 'bg-volt-400/40 text-ink-900' },
}

export function StatusBadge({ status, className = '' }: { status: ProductStatus; className?: string }) {
  const s = productStatus[status]
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${s.cls} ${className}`}>
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${status === 'available' ? 'bg-charge-500' : status === 'out_of_stock' ? 'bg-slate-ink' : 'bg-volt-500'}`}
      />
      {s.label}
    </span>
  )
}
