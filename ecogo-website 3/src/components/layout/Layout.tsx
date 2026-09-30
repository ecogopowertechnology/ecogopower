import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/** Scroll to the top on navigation, and move focus to the page so keyboard and screen reader users start fresh. */
function RouteChange() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    // Leave the very first page load alone so the skip link is still the first Tab stop.
    if (first.current) {
      first.current = false
      return
    }
    if (hash) return
    window.scrollTo({ top: 0, left: 0 })
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])
  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="absolute left-4 top-4 z-50 -translate-y-24 rounded-md bg-ink-900 px-4 py-3 font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <RouteChange />
    </>
  )
}
