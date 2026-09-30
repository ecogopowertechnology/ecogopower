import { useEffect } from 'react'

interface PageMeta {
  title: string
  description: string
  path: string
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/** Keeps the tab title, description, canonical and Open Graph tags in step with the current page. */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const full = path === '/' || title.includes('Ecogo') ? title : `${title} | Ecogo`
    document.title = full
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)

    const url = `${window.location.origin}${path === '/' ? '' : path}`
    setMeta('property', 'og:url', url)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path])
}
