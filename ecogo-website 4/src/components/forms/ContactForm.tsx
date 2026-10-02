import { useId, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { contactReasons, type ContactReason } from '@/content/site'
import { submitContact } from '@/lib/forms'
import { Field, inputClass } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { AlertIcon, CheckIcon } from '@/components/ui/Icons'

interface Props {
  initialReason?: ContactReason
  initialMessage?: string
}

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function ContactForm({ initialReason = 'general', initialMessage = '' }: Props) {
  const uid = useId()
  const { pathname } = useLocation()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    reason: initialReason,
    message: initialMessage,
  })
  const [trap, setTrap] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const set =
    (key: keyof typeof values) =>
    (e: { target: { value: string } }) =>
      setValues((v) => ({ ...v, [key]: e.target.value }))

  function validate(): Errors {
    const next: Errors = {}
    if (!values.name.trim()) next.name = 'Enter your name.'
    if (!values.email.trim()) next.email = 'Enter your email address.'
    else if (!EMAIL.test(values.email.trim())) next.email = 'Enter an email address like name@example.com.'
    if (!values.message.trim()) next.message = 'Write a short message so we know how to help.'
    return next
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    if (trap) {
      setStatus({ kind: 'sent' }) // bots fill the hidden field: pretend it worked
      return
    }
    setStatus({ kind: 'sending' })
    const result = await submitContact({ ...values, sourcePage: pathname })
    setStatus(result.ok ? { kind: 'sent' } : { kind: 'error', message: result.message })
  }

  if (status.kind === 'sent') {
    return (
      <div role="status" className="rounded-[var(--radius-panel)] bg-charge-400/20 p-8 md:p-10">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-charge-500 text-white">
          <CheckIcon />
        </span>
        <h2 className="t-h3 mt-5">Message sent</h2>
        <p className="mt-3 max-w-[46ch]">
          Thank you, {values.name.split(' ')[0] || 'and welcome'}. We have your message and will reply to {values.email || 'you'} as soon as we can.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6" aria-describedby={status.kind === 'error' ? `${uid}-form-error` : undefined}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Your name" error={errors.name}>
          {(aria) => (
            <input id={`${uid}-name`} name="name" type="text" autoComplete="name" className={inputClass} value={values.name} onChange={set('name')} {...aria} />
          )}
        </Field>
        <Field id={`${uid}-email`} label="Email address" error={errors.email}>
          {(aria) => (
            <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" className={inputClass} value={values.email} onChange={set('email')} {...aria} />
          )}
        </Field>
        <Field id={`${uid}-phone`} label="Phone" optional>
          {(aria) => (
            <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} value={values.phone} onChange={set('phone')} {...aria} />
          )}
        </Field>
        <Field id={`${uid}-org`} label="Company or organisation" optional>
          {(aria) => (
            <input id={`${uid}-org`} name="organisation" type="text" autoComplete="organization" className={inputClass} value={values.organisation} onChange={set('organisation')} {...aria} />
          )}
        </Field>
      </div>

      <Field id={`${uid}-reason`} label="What is this about?">
        {(aria) => (
          <select id={`${uid}-reason`} name="reason" className={inputClass} value={values.reason} onChange={set('reason')} {...aria}>
            {contactReasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field id={`${uid}-message`} label="Message" error={errors.message}>
        {(aria) => (
          <textarea id={`${uid}-message`} name="message" rows={6} className={`${inputClass} resize-y`} value={values.message} onChange={set('message')} {...aria} />
        )}
      </Field>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input tabIndex={-1} autoComplete="off" name="website_url" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      {status.kind === 'error' && (
        <p id={`${uid}-form-error`} role="alert" className="flex gap-3 rounded-[var(--radius-control)] bg-clay-600/10 p-4 font-medium text-clay-600">
          <AlertIcon className="mt-0.5 shrink-0" />
          {status.message}
        </p>
      )}

      <Button type="submit" disabled={status.kind === 'sending'} className="w-full sm:w-auto">
        {status.kind === 'sending' ? 'Sending message' : 'Send message'}
      </Button>
    </form>
  )
}
