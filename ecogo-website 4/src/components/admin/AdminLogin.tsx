import { useId, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { Field, inputClass } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'

export function AdminLogin() {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (err) setError('That email and password did not match. Please check them and try again.')
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="t-h1 !text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)]">Admin sign in</h1>
      <p className="mt-4 text-slate-ink">For Ecogo staff only. Use the account created in Supabase.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
        <Field id={`${uid}-email`} label="Email address">
          {(aria) => (
            <input id={`${uid}-email`} type="email" autoComplete="username" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required {...aria} />
          )}
        </Field>
        <Field id={`${uid}-password`} label="Password">
          {(aria) => (
            <input id={`${uid}-password`} type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required {...aria} />
          )}
        </Field>
        {error && (
          <p role="alert" className="rounded-[var(--radius-control)] bg-clay-600/10 p-4 font-medium text-clay-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy || !email || !password} className="w-full">
          {busy ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
