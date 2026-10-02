import { useEffect, useState } from 'react'
import { listMessages, setMessageStatus, type ContactMessage, type MessageStatus } from '@/lib/admin'
import { contactReasons, whatsappLink } from '@/content/site'

const reasonLabel = (v: string) => contactReasons.find((r) => r.value === v)?.label ?? v

export function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listMessages().then(setMessages).catch((e) => {
      console.error(e)
      setError('Could not load messages. Check that the database setup (0002_shop_and_admin.sql) has been run.')
    })
  }, [])

  async function change(id: string, status: MessageStatus) {
    const before = messages
    setMessages((m) => (m ?? []).map((x) => (x.id === id ? { ...x, status } : x)))
    try {
      await setMessageStatus(id, status)
    } catch {
      setMessages(before)
      setError('Could not update that message.')
    }
  }

  if (error) return <p role="alert" className="rounded-[var(--radius-control)] bg-clay-600/10 p-4 font-medium text-clay-600">{error}</p>
  if (!messages) return <p className="text-slate-ink">Loading messages</p>
  if (messages.length === 0) return <p className="text-slate-ink">No messages yet.</p>

  return (
    <ul className="space-y-4">
      {messages.map((m) => {
        const digits = m.phone?.replace(/[^\d]/g, '')
        return (
          <li key={m.id} className="rounded-[var(--radius-panel)] bg-white p-5 ring-1 ring-mist-300">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{m.name}{m.organisation ? `, ${m.organisation}` : ''}</p>
                <p className="text-sm text-slate-ink">
                  {new Date(m.createdAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })} · {reasonLabel(m.reason)}
                </p>
              </div>
              <label className="text-sm font-semibold">
                <span className="sr-only">Status of message from {m.name}</span>
                <select
                  value={m.status}
                  onChange={(e) => void change(m.id, e.target.value as MessageStatus)}
                  className="min-h-11 rounded-[var(--radius-control)] border-2 border-mist-400 bg-white px-3"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            </div>
            <p className="mt-4 whitespace-pre-wrap">{m.message}</p>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-semibold text-brand-blue">
              <a className="underline underline-offset-4" href={`mailto:${m.email}`}>{m.email}</a>
              {m.phone && <a className="underline underline-offset-4" href={`tel:${m.phone.replace(/\s/g, '')}`}>{m.phone}</a>}
              {digits && whatsappLink() && <a className="underline underline-offset-4" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">WhatsApp them</a>}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
