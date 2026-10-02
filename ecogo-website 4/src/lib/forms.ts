import { supabase } from './supabase'
import type { SubmitResult } from './types'
import type { ContactReason } from '@/content/site'

const NOT_CONFIGURED = 'Sending is not switched on for this site yet. Please contact us directly instead.'
const GENERIC_ERROR =
  'Something went wrong and your message was not sent. Please try again in a moment, or contact us directly.'

const clean = (v: string) => v.trim()
const orNull = (v: string) => (clean(v) === '' ? null : clean(v))

export interface ContactInput {
  name: string
  email: string
  phone: string
  organisation: string
  reason: ContactReason
  message: string
  sourcePage: string
}

export async function submitContact(input: ContactInput): Promise<SubmitResult> {
  if (!supabase) return { ok: false, message: NOT_CONFIGURED }

  const { error } = await supabase.from('contact_submissions').insert({
    name: clean(input.name),
    email: clean(input.email).toLowerCase(),
    phone: orNull(input.phone),
    organisation: orNull(input.organisation),
    reason: input.reason,
    message: clean(input.message),
    source_page: input.sourcePage.slice(0, 200),
  })

  if (error) {
    console.error('Contact submission failed', error.code, error.message)
    return { ok: false, message: `${GENERIC_ERROR} (Error code: ${error.code || 'unknown'})` }
  }
  return { ok: true }
}

export async function subscribeNewsletter(email: string, sourcePage: string): Promise<SubmitResult> {
  if (!supabase) return { ok: false, message: NOT_CONFIGURED }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: clean(email).toLowerCase(), source_page: sourcePage.slice(0, 200) })

  // 23505 = unique violation: this address is already subscribed. Treat as success so the form
  // never reveals whether an address is on the list.
  if (error && error.code !== '23505') {
    console.error('Newsletter signup failed', error.code, error.message)
    return { ok: false, message: `Could not sign you up just now. Please try again in a moment. (Error code: ${error.code || 'unknown'})` }
  }
  return { ok: true }
}
