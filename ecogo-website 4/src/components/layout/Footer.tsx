import { Link } from 'react-router-dom'
import { company, isPlaceholder, nav } from '@/content/site'
import { Container } from '@/components/ui/Container'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Logo } from '@/components/visuals/Logo'

/** Shows a value, or an obvious to-do marker while it is still a [placeholder]. */
export function Detail({ value }: { value: string }) {
  if (isPlaceholder(value)) {
    return <span className="rounded bg-volt-400/30 px-1.5 py-0.5 text-[0.95em]">{value}</span>
  }
  return <>{value}</>
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink-950 pb-10 pt-16 text-white md:pt-20">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.7fr_1fr] lg:gap-20">
          <div>
            <Logo tone="dark" className="h-11 w-auto" />
            <p className="mt-5 max-w-[34ch] text-white/75">{company.tagline}. Based in {company.city}, {company.country}.</p>
            <dl className="mt-8 space-y-3 text-white/85">
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  {isPlaceholder(company.email) ? (
                    <Detail value={company.email} />
                  ) : (
                    <a href={`mailto:${company.email}`} className="underline underline-offset-4 hover:text-charge-400">
                      {company.email}
                    </a>
                  )}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>
                  {isPlaceholder(company.phone) ? (
                    <Detail value={company.phone} />
                  ) : (
                    <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="underline underline-offset-4 hover:text-charge-400">
                      {company.phone}
                    </a>
                  )}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Address</dt>
                <dd><Detail value={company.address} /></dd>
              </div>
              <div>
                <dt className="sr-only">Opening hours</dt>
                <dd className="text-white/70"><Detail value={company.hours} /></dd>
              </div>
            </dl>
            <SocialLinks tone="dark" className="mt-7" />
          </div>

          <nav aria-label="Footer">
            <h2 className="text-2xl [font-stretch:85%]">Explore</h2>
            <ul className="mt-4 space-y-1">
              {[{ to: '/', label: 'Home' }, ...nav].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex min-h-11 items-center text-white/85 underline-offset-4 hover:text-charge-400 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <NewsletterForm />
        </div>

        <p className="mt-16 border-t border-white/15 pt-6 text-sm text-white/60">
          &copy; {year} {company.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
