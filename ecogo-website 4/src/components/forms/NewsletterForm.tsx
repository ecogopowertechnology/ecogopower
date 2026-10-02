import { useId, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { subscribeNewsletter } from '@/lib/forms'

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done' } | { kind: 'error'; message: string }

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Email signup, built for the dark footer. */
export function NewsletterForm() {
  const id = useId()
  const { pathname } = useLocation()
  const [email, setEmail] = useState('')
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setState({ kind: 'error', message: 'Enter an email address like name@example.com.' })
      return
    }
    if (trap) {
      setState({ kind: 'done' }) // a bot filled the hidden field: pretend it worked
      return
    }
    setState({ kind: 'sending' })
    const result = await subscribeNewsletter(email, pathname)
    if (result.ok) {
      setEmail('')
      setState({ kind: 'done' })
    } else {
      setState({ kind: 'error', message: result.message })
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-2xl [font-stretch:85%]">
        Get updates from Ecogo
      </h2>
      <p className="mt-2 max-w-[38ch] text-white/75">
        New products and news about the power bank project. No spam, and you can leave at any time.
      </p>

      {state.kind === 'done' ? (
        <p role="status" className="mt-5 rounded-[var(--radius-control)] bg-charge-400/20 px-4 py-3 font-medium">
          Thank you. You are on the list.
        </p>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={state.kind === 'error' || undefined}
              aria-describedby={state.kind === 'error' ? `${id}-error` : undefined}
              className="min-h-12 flex-1 rounded-[var(--radius-control)] border-2 border-white/30 bg-transparent px-4 text-white placeholder:text-white/55 focus:border-white"
            />
            {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Leave this field empty
                <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </label>
            </div>
            <button
              type="submit"
              disabled={state.kind === 'sending'}
              className="min-h-12 rounded-[var(--radius-control)] bg-charge-400 px-6 font-semibold text-ink-950 transition-colors hover:bg-white disabled:opacity-60"
            >
              {state.kind === 'sending' ? 'Signing you up' : 'Subscribe'}
            </button>
          </div>
          {state.kind === 'error' && (
            <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-volt-400">
              {state.message}
            </p>
          )}
        </>
      )}
    </form>
  )
}
