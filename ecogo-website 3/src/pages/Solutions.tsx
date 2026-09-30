import { useMemo, useState } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useProducts } from '@/hooks/useCatalogue'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ProductRow } from '@/components/ui/ProductCard'

export default function Solutions() {
  usePageMeta({
    title: 'Solutions: solar, security and electronics',
    description:
      'Solar lighting, security cameras, memory cards and accessories from Ecogo in Nairobi, plus the upcoming shared power bank network.',
    path: '/solutions',
  })
  const products = useProducts()
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
            Practical products for homes, shops and businesses in Kenya, and new services that are on the way.
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
                    c === category
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-mist-400 hover:border-ink-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Container>
        <div className="divide-y divide-mist-300">
          {shown.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </div>
      </Container>

      <Section tone="sage" className="mt-8">
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
