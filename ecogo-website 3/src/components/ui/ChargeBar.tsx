interface Props {
  total: number
  filled: number
  /** Accessible description, e.g. "Stage 2 of 5: Pilot preparation" */
  label: string
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Segmented bar in the shape of a battery indicator. It is Ecogo's recurring motif and is used
 * wherever there is real progress to show (the project stage), never as decoration.
 */
export function ChargeBar({ total, filled, label, tone = 'light', className = '' }: Props) {
  const off = tone === 'dark' ? 'bg-white/15' : 'bg-ink-900/12'
  return (
    <div role="img" aria-label={label} className={`flex items-center gap-1 ${className}`}>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-3.5 flex-1 rounded-[5px] ${
              i < filled ? (i === filled - 1 ? 'bg-volt-500' : 'bg-charge-500') : off
            }`}
          />
        ))}
      </div>
      <span className={`h-2.5 w-1 rounded-r-sm ${tone === 'dark' ? 'bg-white/30' : 'bg-ink-900/30'}`} />
    </div>
  )
}
