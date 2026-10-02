import type { ReactNode } from 'react'
import { Container } from './Container'

type Tone = 'plain' | 'sage' | 'dark'

const tones: Record<Tone, string> = {
  plain: 'bg-mist-50 text-ink-900',
  sage: 'bg-mist-200 text-ink-900',
  dark: 'bg-ink-900 text-white',
}

interface Props {
  tone?: Tone
  id?: string
  labelledBy?: string
  className?: string
  children: ReactNode
}

/** A full-width band with consistent vertical rhythm. Padding lives here only, so pages never fight it. */
export function Section({ tone = 'plain', id, labelledBy, className = '', children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} py-20 md:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}
