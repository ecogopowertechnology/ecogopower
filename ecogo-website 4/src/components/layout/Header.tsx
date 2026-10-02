import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '@/content/site'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { CloseIcon, MenuIcon } from '@/components/ui/Icons'
import { Logo } from '@/components/visuals/Logo'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-base font-medium underline-offset-[10px] decoration-2 hover:underline hover:decoration-mist-400 ${
    isActive ? 'underline decoration-charge-500 hover:decoration-charge-500' : ''
  }`

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [location.pathname])

  // Escape closes the menu and returns focus to its button.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-mist-300 bg-mist-50">
      <Container className="flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link to="/" aria-label="Ecogo home" className="-ml-1 rounded-md p-1">
          <Logo className="h-9 w-auto md:h-10" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <Button to="/contact" className="min-h-11 px-5 py-2">
            Talk to us
          </Button>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="-mr-2 inline-flex size-12 items-center justify-center rounded-md md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
        </button>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-mist-300 bg-mist-50 md:hidden">
        <Container className="pb-6 pt-2">
          <nav aria-label="Mobile">
            <ul>
              {nav.map((item) => (
                <li key={item.to} className="border-b border-mist-300 last:border-0">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex min-h-14 items-center font-display text-2xl font-bold [font-stretch:85%] ${
                        isActive ? 'text-charge-700' : ''
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Button to="/contact" className="mt-4 w-full">
            Talk to us
          </Button>
        </Container>
      </div>
    </header>
  )
}
