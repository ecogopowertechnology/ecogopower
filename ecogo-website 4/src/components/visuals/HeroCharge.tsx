import { useEffect, useState } from 'react'

const SEGMENTS = 10
const START = 8 // a phone at 8% is the moment Ecogo exists for

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * The hero graphic: a battery that charges from 8% to 100% once, on load.
 * It is the site's one orchestrated animation. With reduced motion it simply shows 100%.
 */
export function HeroCharge() {
  const reduced = prefersReducedMotion()
  const [pct, setPct] = useState(reduced ? 100 : START)

  useEffect(() => {
    if (reduced) return
    const duration = 1800
    const delay = 350
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration))
      const eased = 1 - Math.pow(1 - t, 3)
      setPct(Math.round(START + (100 - START) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <figure className="w-full" aria-label="A phone battery charging from 8 percent to 100 percent">
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-[clamp(4.5rem,3rem+7vw,9rem)] font-extrabold leading-[0.85] tracking-tighter [font-stretch:78%] tabular-nums"
          aria-hidden="true"
        >
          {pct}
          <span className="text-[0.5em]">%</span>
        </span>
      </div>

      <div className="mt-6 flex items-center" aria-hidden="true">
        <div className="flex flex-1 gap-1.5 rounded-[1.75rem] border-[6px] border-ink-900 p-2 sm:gap-2 sm:p-2.5">
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const first = i === 0
            const style = reduced
              ? undefined
              : {
                  opacity: first ? 1 : 0.14,
                  animation: `seg-on 260ms ease-out ${350 + (i / SEGMENTS) * 1500}ms forwards`,
                }
            return (
              <span
                key={i}
                style={style}
                className={`h-16 flex-1 rounded-[0.6rem] sm:h-24 lg:h-28 ${first && !reduced ? 'bg-volt-500' : 'bg-charge-500'}`}
              >
                {first && !reduced && (
                  <span
                    className="block h-full w-full rounded-[0.6rem] bg-charge-500"
                    style={{ opacity: 0, animation: 'seg-on 260ms ease-out 700ms forwards' }}
                  />
                )}
              </span>
            )
          })}
        </div>
        <span className="h-10 w-2.5 rounded-r-md bg-ink-900 sm:h-14 sm:w-3" />
      </div>

      <figcaption className="mt-5 max-w-[34ch] text-base text-slate-ink">
        A flat phone should not end your day. Ecogo is building the way to fix that on the go.
      </figcaption>
    </figure>
  )
}
