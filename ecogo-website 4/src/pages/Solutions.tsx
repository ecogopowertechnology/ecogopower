import { useMemo, useState } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useProducts } from '@/hooks/useCatalogue'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'

export default function Solutions() {
  usePageMeta({
    title: 'Solutions and products',
    description:
      'Browse solar lighting, security cameras, memory cards and accessories from Ecogo in Nairobi, with prices in Kenya shillings, plus the upcoming shared power bank network.',
    path: '/solutions',
  })
  const { products, loading } = useProducts()
  const [category, setCategory] = useState<string>('All')

  // Categories come from the data, so adding a product with a new category adds a filter automatically.
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products])
  const shown = category === 'All' ? products : products.filter((p) => p.category === category)

  return (
    <>
      <section aria-labelledby="solutions-title" className="pb-8 pt-14 md:pt-24">
        <Container>
          <h1 id="solutions-title" className="t-h1">
            Solutions
          </h1>
          <p className="t-lead mt-8 max-w-[52ch] text-slate-ink">
            Practical products for homes, shops and businesses in Kenya. Message us on WhatsApp to order or to ask about anything you do not see here.
          </p>

          {categories.length > 2 && (
            <div role="group" aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={c === category}
                  onClick={() => setCategory(c)}
                  className={`min-h-11 rounded-full border-2 px-5 text-base font-semibold transition-colors ${
                    c === category ? 'border-ink-900 bg-ink-900 text-white' : 'border-mist-400 hover:border-ink-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Container className="pb-4 pt-6">
        {loading ? (
          <div aria-busy="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <span className="sr-only">Loading products</span>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-96 rounded-[var(--radius-panel)] bg-mist-200" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className="py-16 text-lg text-slate-ink">Products are being added. Message us on WhatsApp to ask what is in stock.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>

      <Section tone="sage" className="mt-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="t-h2 max-w-[18ch]">Need something specific?</h2>
            <p className="mt-4 max-w-[46ch] text-slate-ink">
              If you are looking for a product that is not listed, or want a larger order, we can look into sourcing it.
            </p>
          </div>
          <Button to="/contact?reason=sourcing">Ask about sourcing</Button>
        </div>
      </Section>
    </>
  )
}
