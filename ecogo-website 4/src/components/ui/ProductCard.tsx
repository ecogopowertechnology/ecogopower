import { Link } from 'react-router-dom'
import type { Product } from '@/lib/types'
import { formatKes } from '@/lib/format'
import { whatsappLink } from '@/content/site'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import { ProductVisual } from '@/components/visuals/ProductVisual'
import { WhatsAppIcon } from './Icons'

/** Products that have their own dedicated page. Everything else uses the generic product page. */
const dedicatedPages: Record<string, string> = {
  'shared-power-banks': '/power-bank',
}

export const productPath = (p: Pick<Product, 'slug'>): string => dedicatedPages[p.slug] ?? `/solutions/${p.slug}`

export function Price({ product, className = '' }: { product: Pick<Product, 'priceKes' | 'status'>; className?: string }) {
  if (product.status === 'in_development') return null
  return product.priceKes !== null ? (
    <span className={`font-display text-2xl font-bold [font-stretch:88%] ${className}`}>{formatKes(product.priceKes)}</span>
  ) : (
    <span className={`text-slate-ink ${className}`}>Message us for the price</span>
  )
}

/** WhatsApp message for a given product and intent. */
export function productMessage(p: Product): string {
  if (p.status === 'available') {
    return p.priceKes !== null
      ? `Hello Ecogo, I would like to order: ${p.name} (${formatKes(p.priceKes)}).`
      : `Hello Ecogo, I would like to know the price of: ${p.name}.`
  }
  return `Hello Ecogo, I would like to ask about: ${p.name}.`
}

export function orderLabel(p: Product): string {
  if (p.status === 'available') return p.priceKes !== null ? 'Order on WhatsApp' : 'Ask for the price'
  if (p.status === 'out_of_stock') return 'Ask when it is back'
  return 'Ask about this'
}

/** Call-to-action for a product. Uses WhatsApp when available, otherwise the contact form. */
export function ProductAction({ product, variant = 'primary', className = '' }: { product: Product; variant?: 'primary' | 'secondary'; className?: string }) {
  if (product.slug in dedicatedPages) {
    return (
      <Button to={dedicatedPages[product.slug]} variant={variant} className={className}>
        {product.ctaLabel}
      </Button>
    )
  }
  const href = whatsappLink(productMessage(product))
  if (href) {
    return (
      <Button href={href} external variant={variant} className={className}>
        <WhatsAppIcon className="mr-2.5" width={22} height={22} />
        {orderLabel(product)}
      </Button>
    )
  }
  return (
    <Button to={`/contact?reason=products&product=${encodeURIComponent(product.slug)}`} variant={variant} className={className}>
      {orderLabel(product)}
    </Button>
  )
}

/** Compact version for the home page. */
export function ProductTile({ product }: { product: Product }) {
  return (
    <article className="flex flex-col">
      <Link to={productPath(product)} className="group block">
        <ProductVisual product={product} className="aspect-[4/3] rounded-[var(--radius-panel)]" />
        <h3 className="t-h3 mt-5 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">{product.name}</h3>
      </Link>
      <p className="mt-2 max-w-[40ch] text-slate-ink">{product.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <StatusBadge status={product.status} />
        <Price product={product} className="!text-xl" />
      </div>
    </article>
  )
}

/** Shop grid card: photo, name, price, status and a call to action. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-[var(--radius-panel)] bg-white p-4 ring-1 ring-mist-300">
      <Link to={productPath(product)} className="group block" aria-label={`${product.name}: view details`}>
        <ProductVisual product={product} className="aspect-[4/3] rounded-[1.1rem]" />
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <p className="text-sm font-medium text-charge-700">{product.category}</p>
        <h2 className="t-h3 mt-1">
          <Link to={productPath(product)} className="hover:underline hover:decoration-2 hover:underline-offset-4">
            {product.name}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-slate-ink">{product.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <StatusBadge status={product.status} />
          <Price product={product} />
        </div>
        <div className="mt-auto pt-6">
          <ProductAction product={product} className="w-full" />
        </div>
      </div>
    </article>
  )
}
