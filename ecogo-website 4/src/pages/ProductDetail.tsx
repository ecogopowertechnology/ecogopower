import { Link, useParams } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useProducts } from '@/hooks/useCatalogue'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Price, ProductAction } from '@/components/ui/ProductCard'
import { CheckIcon } from '@/components/ui/Icons'
import { ProductVisual } from '@/components/visuals/ProductVisual'

export default function ProductDetail() {
  const { slug } = useParams()
  const { products, loading } = useProducts()
  const product = products.find((p) => p.slug === slug)

  usePageMeta({
    title: product ? product.name : loading ? 'Loading product' : 'Product not found',
    description: product ? product.summary : 'Browse the products Ecogo sells in Nairobi, Kenya.',
    path: `/solutions/${slug ?? ''}`,
  })

  if (loading) return <Container className="min-h-[60vh] py-24" aria-busy="true"><span className="sr-only">Loading product</span></Container>

  if (!product) {
    return (
      <Container className="py-28 md:py-40">
        <h1 className="t-h1 max-w-[14ch]">Product not found</h1>
        <p className="t-lead mt-6 max-w-[40ch] text-slate-ink">It may have been removed or sold out of the catalogue.</p>
        <Button to="/solutions" className="mt-9">See all solutions</Button>
      </Container>
    )
  }

  return (
    <Container className="pb-24 pt-10 md:pb-32 md:pt-16">
      <nav aria-label="Breadcrumb" className="text-slate-ink">
        <Link to="/solutions" className="underline underline-offset-4 hover:text-ink-900">Solutions</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-16">
        <ProductVisual product={product} className="aspect-[4/3] rounded-[var(--radius-panel)]" />
        <div>
          <p className="font-medium text-charge-700">{product.category}</p>
          <h1 className="t-h1 mt-2 !text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)]">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <StatusBadge status={product.status} />
            <Price product={product} className="!text-3xl" />
          </div>
          <p className="t-lead mt-6">{product.summary}</p>

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
            <p className="mt-6"><span className="font-semibold">Best for: </span>{product.useCase}</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ProductAction product={product} />
            <Button to={`/contact?reason=products&product=${encodeURIComponent(product.slug)}`} variant="secondary">
              Send an enquiry
            </Button>
          </div>
          <p className="mt-5 text-sm text-slate-ink">
            Ordering is by message for now. Tell us what you need and we will confirm availability and arrange payment and delivery or pickup.
          </p>
        </div>
      </div>
    </Container>
  )
}
