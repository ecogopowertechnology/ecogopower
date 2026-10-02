import { usePageMeta } from '@/hooks/usePageMeta'
import { company, isPlaceholder } from '@/content/site'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Detail } from '@/components/layout/Footer'

const problems = [
  {
    title: 'Power cuts and flat batteries interrupt the day',
    body: 'Lost light, lost charge and lost connection cost people time and small businesses money.',
  },
  {
    title: 'Good products can be hard to find',
    body: 'Customers want electronics and energy products they can understand and rely on, at a fair price.',
  },
  {
    title: 'Small businesses need practical tools',
    body: 'Lighting, security and storage that fit a shop or a stall, not just a large company.',
  },
]

export default function About() {
  usePageMeta({
    title: 'About Ecogo',
    description:
      'Ecogo Power Technology Limited is a Nairobi-based company working in technology, energy and mobility, focused on practical, accessible products and services.',
    path: '/about',
  })

  return (
    <>
      <section aria-labelledby="about-title" className="pb-16 pt-14 md:pb-24 md:pt-24">
        <Container>
          <h1 id="about-title" className="t-h1 max-w-[16ch]">
            About Ecogo
          </h1>
          <p className="t-lead mt-8 max-w-[52ch]">
            Ecogo Power Technology Limited is a company based in {company.city}, {company.country}. We work across
            technology, energy and mobility, with a focus on products and services that are practical and within reach of
            ordinary customers and small businesses.
          </p>
        </Container>
      </section>

      <Section tone="sage" labelledBy="purpose-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 id="purpose-title" className="t-h2">
            Our purpose
          </h2>
          <div className="prose-ecogo measure">
            <p className="t-lead">
              To make dependable power and useful technology easier to get, in the places and at the scale where people
              actually live and work.
            </p>
            <p className="text-slate-ink">
              That means starting with real, everyday needs, keeping products simple, and being honest about what is
              available today and what is still being built.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="approach-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 id="approach-title" className="t-h2">
            Our approach
          </h2>
          <div className="prose-ecogo measure">
            <p>
              We sell products that are ready now, and we develop new services in stages. Ideas like the shared power bank
              network start as a pilot, so the design can be shaped by real use before it grows.
            </p>
            <p>
              We run our operations from Nairobi and source products from manufacturers in China. Where possible we work
              directly, which keeps products practical and keeps us close to what customers ask for.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="sage" labelledBy="markets-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 id="markets-title" className="t-h2">
            Who we serve
          </h2>
          <div className="prose-ecogo measure">
            <p>
              We serve individual customers and small businesses in Kenya, starting in Nairobi. That includes households,
              shops and market traders, as well as businesses and organisations that could host or support our services.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="problems-title">
        <h2 id="problems-title" className="t-h2 max-w-[20ch]">
          Problems we want to help solve
        </h2>
        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="border-t-2 border-ink-900 pt-6">
              <h3 className="t-h3">{p.title}</h3>
              <p className="mt-3 text-slate-ink">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark" labelledBy="company-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 id="company-title" className="t-h2">
            Company details
          </h2>
          <div>
            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-white/65">Legal name</dt>
                <dd className="mt-1 text-lg font-semibold">{company.legalName}</dd>
              </div>
              <div>
                <dt className="text-white/65">Based in</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {company.city}, {company.country}
                </dd>
              </div>
              <div>
                <dt className="text-white/65">Address</dt>
                <dd className="mt-1 text-lg font-semibold">
                  <Detail value={company.address} />
                </dd>
              </div>
              <div>
                <dt className="text-white/65">Email</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {isPlaceholder(company.email) ? (
                    <Detail value={company.email} />
                  ) : (
                    <a className="underline underline-offset-4" href={`mailto:${company.email}`}>
                      {company.email}
                    </a>
                  )}
                </dd>
              </div>
            </dl>
            <Button to="/contact" variant="primary-dark" className="mt-10">
              Get in touch
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
