import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { usePageMeta } from '@/hooks/usePageMeta'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { ProductsAdmin } from '@/components/admin/ProductsAdmin'
import { MessagesAdmin } from '@/components/admin/MessagesAdmin'

type Tab = 'products' | 'messages'

export default function Admin() {
  usePageMeta({ title: 'Admin', description: 'Ecogo site administration.', path: '/admin' })
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [tab, setTab] = useState<Tab>('products')

  // Keep this page out of search results.
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const signOut = () => void supabase?.auth.signOut()

  let body
  if (!supabase) {
    body = <p className="py-10 text-lg">The database is not connected yet, so the admin area is unavailable.</p>
  } else if (session === undefined) {
    body = <p className="py-10 text-slate-ink" aria-busy="true">Loading</p>
  } else if (!session) {
    body = <AdminLogin />
  } else if (!isAdmin(session)) {
    body = (
      <div className="max-w-xl py-10">
        <h1 className="t-h1 !text-[clamp(2rem,1.5rem+2vw,3rem)]">No admin access</h1>
        <p className="mt-4 text-slate-ink">
          You are signed in as {session.user.email}, but this account has not been given admin access. Ask whoever manages the Supabase project to enable it, then sign out and sign in again.
        </p>
        <Button type="button" variant="secondary" onClick={signOut} className="mt-6">Sign out</Button>
      </div>
    )
  } else {
    body = (
      <div className="py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="t-h1 !text-[clamp(2rem,1.5rem+2vw,3rem)]">Admin</h1>
          <div className="flex items-center gap-4">
            <span className="hidden text-slate-ink sm:inline">{session.user.email}</span>
            <Button type="button" variant="secondary" onClick={signOut} className="min-h-11 px-4 py-2">Sign out</Button>
          </div>
        </div>

        <div role="tablist" aria-label="Admin sections" className="mt-8 flex gap-2 border-b border-mist-300">
          {([['products', 'Products'], ['messages', 'Messages']] as const).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              type="button"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`-mb-px min-h-12 border-b-4 px-4 text-base font-semibold ${tab === id ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-ink hover:text-ink-900'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
          {tab === 'products' ? <ProductsAdmin /> : <MessagesAdmin />}
        </div>
      </div>
    )
  }

  return <Container className="min-h-[70vh] pb-24 pt-8">{body}</Container>
}
