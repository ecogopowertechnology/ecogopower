import { usePageMeta } from '@/hooks/usePageMeta'
import { usePowerBankProject } from '@/hooks/useCatalogue'
import { projectStages } from '@/content/project'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ChargeBar } from '@/components/ui/ChargeBar'
import { CheckIcon, ClockIcon, HandshakeIcon, PhoneIcon, PinIcon, StoreIcon, BoltIcon } from '@/components/ui/Icons'
import { StationMap } from '@/components/visuals/StationMap'

const steps = [
  { icon: PinIcon, title: 'Find a station', body: 'Pick up a charged power bank from a station near you.' },
  { icon: PhoneIcon, title: 'Charge as you go', body: 'Plug it in and carry on with your day while your phone charges.' },
  { icon: BoltIcon, title: 'Return it anywhere in the network', body: 'Drop it at any compatible station, not only the one you started from.' },
]

const userBenefits = [
  'Charge without hunting for a socket or a friendly shopkeeper',
  'No need to carry your own charger and cable everywhere',
  'Return it at a different station from where you picked it up',
  'Payment by mobile money is planned, so no card is needed',
]

const places = [
  'Shops and shopping centres',
  'Restaurants and cafes',
  'Transport stops and stages',
  'Colleges and universities',
  'Offices and co-working spaces',
  'Events and public venues',
]

const partnerBenefits = [
  'A helpful extra for the customers and visitors already at your premises',
  'Being part of a local network of stations rather than a one-off charger',
  'Terms that are explained clearly. Details will be agreed with pilot partners',
]

const today = [
  'The concept and how the service should work are defined',
  'Hardware, payments and first locations are being prepared for a pilot',
  'Payment by mobile money is the planned way to pay',
]

const notYetDecided = ['Launch date', 'Station locations and how many', 'Pricing', 'Partner businesses and locations']

export default function PowerBank() {
  usePageMeta({
    title: 'Shared power banks: borrow and return',
    description:
      'Ecogo is developing a network of shared power bank stations in Kenya: borrow a power bank, use it, and return it at any compatible station.',
    path: '/power-bank',
  })
  const project = usePowerBankProject()
  const stageIndex = Math.max(0, projectStages.findIndex((s) => s.key === project.status))
  const stage = projectStages[stageIndex]

  return (
    <>
      {/* Intro */}
      <section aria-labelledby="pb-title" className="pb-16 pt-14 md:pb-24 md:pt-24">
        <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <h1 id="pb-title" className="t-h1 max-w-[12ch]">
              Shared power banks
            </h1>
            <p className="t-lead mt-8 max-w-[46ch]">
              Borrow a power bank from a station, use it while you are out, and return it at any compatible station. No
              more watching your battery drop to red.
            </p>
            <div className="mt-8 max-w-md rounded-[var(--radius-panel)] bg-mist-200 p-6">
              <p className="font-semibold">
                Project status: <span className="text-charge-700">{stage.label}</span>
              </p>
              <ChargeBar
                total={projectStages.length}
                filled={stageIndex + 1}
                label={`Project stage ${stageIndex + 1} of ${projectStages.length}: ${stage.label}`}
                className="mt-3"
              />
              <p className="mt-3 text-slate-ink">
                This service is <strong className="text-ink-900">not operating yet</strong>. What you read below
                describes what Ecogo is building.
              </p>
              {project.launchNote && <p className="mt-2 font-medium">{project.launchNote}</p>}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/contact?reason=powerbank_partner">Partner or invest</Button>
              <Button to="/contact?reason=powerbank_host" variant="secondary">
                Host stations at your business
              </Button>
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] bg-ink-900 p-4 sm:p-8">
            <StationMap className="w-full" />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <Section tone="sage" labelledBy="how-title">
        <h2 id="how-title" className="t-h2">
          How it will work
        </h2>
        <p className="mt-4 max-w-[52ch] text-slate-ink">
          This is the planned experience. Details may change as the pilot teaches us what works.
        </p>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink-900 pt-6">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-extrabold leading-none [font-stretch:78%]" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-charge-400/50">
                  <s.icon />
                </span>
              </div>
              <h3 className="t-h3 mt-5">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-3 text-slate-ink">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Why useful / where */}
      <Section labelledBy="useful-title">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="useful-title" className="t-h2 max-w-[14ch]">
              Why it is useful
            </h2>
            <p className="mt-5 max-w-[46ch] text-slate-ink">
              A phone at 5% is a small problem that becomes a big one: you cannot call, navigate, pay or reach anyone.
              Shared power banks are meant to make a top-up easy wherever you happen to be.
            </p>
            <ul className="mt-8 space-y-3.5">
              {userBenefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-charge-700" width={22} height={22} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-h2 max-w-[14ch]">Where it could be used</h2>
            <p className="mt-5 max-w-[46ch] text-slate-ink">
              We are looking at places where people spend time and their phones run low. No locations are confirmed yet.
            </p>
            <ul className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {places.map((p) => (
                <li key={p} className="flex gap-3">
                  <PinIcon className="mt-0.5 shrink-0 text-charge-700" width={22} height={22} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Partners */}
      <Section tone="dark" labelledBy="partners-title">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 id="partners-title" className="t-h2 max-w-[16ch]">
              For businesses and locations
            </h2>
            <p className="t-lead mt-6 max-w-[44ch] text-white/80">
              If people gather at your business, hosting a station could make it more useful to them.
            </p>
            <ul className="mt-8 space-y-3.5">
              {partnerBenefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <StoreIcon className="mt-0.5 shrink-0 text-charge-400" width={22} height={22} />
                  <span className="text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start rounded-[var(--radius-panel)] bg-ink-800 p-8 md:p-10">
            <HandshakeIcon width={36} height={36} className="text-charge-400" />
            <h3 className="t-h3 mt-5">Partners and investors</h3>
            <p className="mt-3 max-w-[44ch] text-white/80">
              We are speaking with businesses that could host stations and with people interested in supporting the
              network. Tell us who you are and what you have in mind.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button to="/contact?reason=powerbank_partner" variant="primary-dark">
                Partner or invest
              </Button>
              <Button to="/contact?reason=powerbank_host" variant="secondary-dark">
                Host stations
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Status: today vs planned */}
      <Section labelledBy="status-title">
        <h2 id="status-title" className="t-h2">
          Where the project stands
        </h2>
        <p className="mt-4 max-w-[52ch] text-slate-ink">
          We want to be clear about what is real today and what is still ahead.
        </p>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Project stages">
          {projectStages.map((s, i) => {
            const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'next'
            return (
              <li
                key={s.key}
                aria-current={state === 'current' ? 'step' : undefined}
                className={`rounded-2xl p-5 ${
                  state === 'current'
                    ? 'bg-volt-400/55'
                    : state === 'done'
                      ? 'bg-charge-400/30'
                      : 'border-2 border-dashed border-mist-400'
                }`}
              >
                <p className="font-display text-xl font-bold [font-stretch:85%]">{s.label}</p>
                <p className="mt-1 text-sm text-slate-ink">{s.note}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {state === 'current' && (
                    <>
                      <ClockIcon width={16} height={16} /> We are here
                    </>
                  )}
                  {state === 'done' && (
                    <>
                      <CheckIcon width={16} height={16} /> Complete
                    </>
                  )}
                  {state === 'next' && 'Planned'}
                </p>
              </li>
            )
          })}
        </ol>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="t-h3">Where things stand today</h3>
            <ul className="mt-5 space-y-3">
              {today.map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-charge-700" width={22} height={22} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="t-h3">Not decided or announced yet</h3>
            <ul className="mt-5 space-y-3">
              {notYetDecided.map((t) => (
                <li key={t} className="flex gap-3">
                  <ClockIcon className="mt-0.5 shrink-0 text-slate-ink" width={22} height={22} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-slate-ink">We will publish these here once they are confirmed.</p>
          </div>
        </div>
      </Section>

      <Section tone="sage">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="t-h2 max-w-[20ch]">Interested in the power bank project?</h2>
            <p className="mt-4 max-w-[46ch] text-slate-ink">
              Whether you would like to use it, host it or back it, we would like to hear from you.
            </p>
          </div>
          <Button to="/contact?reason=powerbank_partner">Get in touch</Button>
        </div>
      </Section>
    </>
  )
}
