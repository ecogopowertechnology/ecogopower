import type { Product } from '@/lib/types'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import { ProductVisual } from '@/components/visuals/ProductVisual'
import { CheckIcon } from './Icons'

/** Products that have their own page. Everything else sends the visitor to the contact form with the product prefilled. */
const dedicatedPages: Record<string, string> = {
  'shared-power-banks': '/power-bank',
}

export function productLink(p: Pick<Product, 'slug' | 'name'>): string {
  return dedicatedPages[p.slug] ?? `/contact?reason=products&product=${encodeURIComponent(p.slug)}`
}

/** Compact version for the home page. */
export function ProductTile({ product }: { product: Product }) {
  return (
    <article className="flex flex-col">
      <ProductVisual product={product} className="aspect-[4/3] rounded-[var(--radius-panel)]" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 className="t-h3">{product.name}</h3>
      </div>
      <p className="mt-2 max-w-[40ch] text-slate-ink">{product.summary}</p>
      <div className="mt-4">
        <StatusBadge status={product.status} />
      </div>
    </article>
  )
}

/** Full version for the solutions page: name, visual, description, features, use case, status and call to action. */
export function ProductRow({ product }: { product: Product }) {
  return (
    <article className="grid items-center gap-8 py-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14 md:py-16">
      <ProductVisual product={product} className="aspect-[4/3] rounded-[var(--radius-panel)]" />
      <div>
        <p className="text-base font-medium text-charge-700">{product.category}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
          <h2 className="t-h2">{product.name}</h2>
        </div>
        <div className="mt-4">
          <StatusBadge status={product.status} />
        </div>
        <p className="t-lead mt-5 max-w-[50ch]">{product.summary}</p>

        {product.features.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {product.features.map((f) => (
              <li key={f} className="flex gap-3">
                <CheckIcon className="mt-0.5 shrink-0 text-charge-700" width={22} height={22} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {product.useCase && (
          <p className="mt-6 max-w-[50ch]">
            <span className="font-semibold">Best for: </span>
            {product.useCase}
          </p>
        )}

        <div className="mt-8">
          <Button to={productLink(product)} variant={product.status === 'available' ? 'primary' : 'secondary'}>
            {product.ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
