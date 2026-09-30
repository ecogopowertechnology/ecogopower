import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useProducts, usePowerBankProject } from '@/hooks/useCatalogue'
import { projectStages } from '@/content/project'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ChargeBar } from '@/components/ui/ChargeBar'
import { ProductTile } from '@/components/ui/ProductCard'
import { BoltIcon, BoxIcon, HomeIcon, StepsIcon, StoreIcon, SunIcon } from '@/components/ui/Icons'
import { HeroCharge } from '@/components/visuals/HeroCharge'
import { StationMap } from '@/components/visuals/StationMap'

const areas = [
  {
    icon: SunIcon,
    tint: 'bg-volt-400/45',
    title: 'Solar products and consumer electronics',
    body: 'Solar lighting, security cameras, memory cards and everyday accessories, sold from Nairobi.',
    to: '/solutions',
    cta: 'Browse solutions',
  },
  {
    icon: BoxIcon,
    tint: 'bg-mist-300',
    title: 'Sourcing and procurement',
    body: 'We source products from manufacturers in China for customers who need specific items or larger orders.',
    to: '/contact?reason=sourcing',
    cta: 'Ask about sourcing',
  },
  {
    icon: BoltIcon,
    tint: 'bg-charge-400/45',
    title: 'Shared power banks',
    body: 'A network of stations for borrowing and returning power banks. In development.',
    to: '/power-bank',
    cta: 'Read about the project',
  },
]

const principles = [
  {
    icon: HomeIcon,
    title: 'Start with an everyday problem',
    body: 'A phone that dies at the wrong moment. A shop with no light after dark. We build and sell things that answer problems people really have.',
  },
  {
    icon: StepsIcon,
    title: 'Pilot before we scale',
    body: 'New services such as the power bank network begin small, so we learn from real use before we grow them.',
  },
  {
    icon: StoreIcon,
    title: 'Local team, direct sourcing',
    body: 'Ecogo runs from Nairobi and sources from manufacturers in China, so we can offer practical products without unnecessary layers in between.',
  },
  {
    icon: BoxIcon,
    title: 'Straightforward products',
    body: 'Products that are easy to understand, easy to buy and easy to use, described plainly and without exaggeration.',
  },
]

export default function Home() {
  usePageMeta({
    title: 'Ecogo | Practical power and technology for everyday Kenya',
    description:
      'Ecogo supplies solar products and consumer electronics from Nairobi, and is developing a shared power bank network for everyday charging in Kenya.',
    path: '/',
  })
  const products = useProducts()
  const project = usePowerBankProject()
  const stageIndex = Math.max(0, projectStages.findIndex((s) => s.key === project.status))
  const stage = projectStages[stageIndex]
  const featured = products.filter((p) => p.status === 'available').slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="pb-20 pt-12 md:pb-28 md:pt-20">
        <Container className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h1 id="hero-title" className="t-display max-w-[13ch]">
              Practical power and technology for everyday Kenya
            </h1>
            <p className="t-lead mt-7 max-w-[46ch] text-slate-ink">
              Ecogo supplies solar products and consumer electronics from Nairobi, and is developing a shared power bank
              network for everyday charging on the go.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/solutions">Explore solutions</Button>
              <Button to="/power-bank" variant="secondary">
                See the power bank project
              </Button>
            </div>
          </div>
          <HeroCharge />
        </Container>
      </section>

      {/* What Ecogo does */}
      <Section tone="sage" labelledBy="areas-title">
        <h2 id="areas-title" className="t-h2 max-w-[18ch]">
          What Ecogo does
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
          {areas.map((a, i) => (
            <div key={a.title} className={`md:px-8 ${i === 0 ? 'md:pl-0' : 'md:border-l md:border-mist-400'} ${i === areas.length - 1 ? 'md:pr-0' : ''}`}>
              <span className={`inline-flex size-14 items-center justify-center rounded-2xl ${a.tint}`}>
                <a.icon width={28} height={28} />
              </span>
              <h3 className="t-h3 mt-6">{a.title}</h3>
              <p className="mt-3 max-w-[36ch] text-slate-ink">{a.body}</p>
              <Link to={a.to} className="mt-5 inline-flex min-h-11 items-center font-semibold text-charge-700 underline underline-offset-4 hover:text-ink-900">
                {a.cta}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Solutions preview */}
      <Section labelledBy="solutions-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 id="solutions-title" className="t-h2">
              Solutions
            </h2>
            <p className="t-lead mt-4 max-w-[46ch] text-slate-ink">
              A growing range of practical products. New categories are added as Ecogo grows.
            </p>
          </div>
          <Button to="/solutions" variant="secondary" className="self-start md:self-auto">
            View all solutions
          </Button>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Power bank project */}
      <Section tone="dark" labelledBy="powerbank-title">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 id="powerbank-title" className="t-h2 max-w-[16ch]">
              Borrow power where you are. Return it where it suits you.
            </h2>
            <p className="t-lead mt-6 max-w-[46ch] text-white/80">
              Ecogo is preparing a pilot of stations where people pick up a power bank, use it, and return it at any
              compatible station.
            </p>

            <div className="mt-9 max-w-md">
              <p className="font-semibold">
                Project status: <span className="text-volt-400">{stage.label}</span>
              </p>
              <ChargeBar
                tone="dark"
                total={projectStages.length}
                filled={stageIndex + 1}
                label={`Project stage ${stageIndex + 1} of ${projectStages.length}: ${stage.label}`}
                className="mt-3"
              />
              <p className="mt-3 text-white/70">
                Not yet operating. Locations, launch date and pricing will be shared once they are confirmed.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/power-bank" variant="primary-dark">
                Learn about the project
              </Button>
              <Button to="/contact?reason=powerbank_partner" variant="secondary-dark">
                Partner with us
              </Button>
            </div>
          </div>
          <StationMap className="mx-auto w-full max-w-xl" />
        </div>
      </Section>

      {/* Why Ecogo */}
      <Section labelledBy="why-title">
        <h2 id="why-title" className="t-h2 max-w-[20ch]">
          How Ecogo works
        </h2>
        <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="flex gap-5 border-t-2 border-ink-900 pt-6">
              <p.icon className="mt-1 shrink-0 text-charge-700" width={30} height={30} />
              <div>
                <h3 className="t-h3">{p.title}</h3>
                <p className="mt-3 max-w-[44ch] text-slate-ink">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* About + contact */}
      <Section tone="sage" labelledBy="about-title" className="!py-0">
        <div className="grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="about-title" className="t-h2 max-w-[16ch]">
              A Nairobi company working in technology and energy
            </h2>
            <p className="mt-6 max-w-[50ch] text-slate-ink">
              Ecogo Power Technology Limited focuses on technology and energy products that make daily life easier, and
              on services that make them easier to reach.
            </p>
            <Link to="/about" className="mt-6 inline-flex min-h-11 items-center font-semibold text-charge-700 underline underline-offset-4 hover:text-ink-900">
              About Ecogo
            </Link>
          </div>
          <div className="rounded-[var(--radius-panel)] bg-ink-900 p-8 text-white md:p-12">
            <h2 className="t-h3">Talk to Ecogo</h2>
            <p className="mt-4 max-w-[40ch] text-white/80">
              Looking for a product, want to source something specific, or interested in hosting or backing the power bank
              network? Send us a message.
            </p>
            <Button to="/contact" variant="primary-dark" className="mt-7">
              Send a message
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
