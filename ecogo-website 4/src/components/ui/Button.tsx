import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'primary-dark' | 'secondary-dark'

const base =
  'inline-flex min-h-12 items-center justify-center rounded-[var(--radius-control)] px-6 py-3 text-base font-semibold ' +
  'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-blue text-white hover:bg-ink-900',
  secondary: 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
  'primary-dark': 'bg-charge-400 text-ink-950 hover:bg-white',
  'secondary-dark': 'border-2 border-white/45 text-white hover:border-white hover:bg-white/10',
}

interface CommonProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & { to?: undefined; href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>
type RouterLinkProps = CommonProps & { to: string; href?: undefined }
type AnchorProps = CommonProps & { href: string; to?: undefined; external?: boolean }

/** One button component for every call to action: a router link, a plain link, or a real <button>. */
export function Button(props: ButtonProps | RouterLinkProps | AnchorProps) {
  const { variant = 'primary', className = '', children } = props
  const cls = `${base} ${variants[variant]} ${className}`

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={cls}>
        {children}
      </Link>
    )
  }
  if (props.href !== undefined) {
    const external = 'external' in props && props.external
    return (
      <a
        href={props.href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  const { variant: _variant, className: _className, children: _children, to: _to, href: _href, ...rest } =
    props as ButtonProps
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
