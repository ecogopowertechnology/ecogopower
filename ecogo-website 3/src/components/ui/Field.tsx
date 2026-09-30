import type { ReactNode } from 'react'

interface Props {
  id: string
  label: string
  optional?: boolean
  error?: string
  hint?: string
  children: (aria: { 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode
}

export const inputClass =
  'block w-full rounded-[var(--radius-control)] border-2 border-mist-400 bg-white px-4 py-3 text-base text-ink-900 ' +
  'placeholder:text-slate-ink transition-colors focus:border-ink-900 aria-[invalid=true]:border-clay-600'

/** Label, input slot, hint and error, wired together for screen readers. */
export function Field({ id, label, optional, error, hint, children }: Props) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-slate-ink">(optional)</span>}
      </label>
      {children({ ...(error ? { 'aria-invalid': true as const } : {}), 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-slate-ink">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-clay-600">
          {error}
        </p>
      )}
    </div>
  )
}
