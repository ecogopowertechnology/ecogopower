import { useEffect, useState } from 'react'
import { fetchProducts, fetchProject } from '@/lib/catalogue'
import { supabase } from '@/lib/supabase'
import { fallbackProducts } from '@/content/products'
import { fallbackPowerBankProject } from '@/content/project'
import type { Product, Project } from '@/lib/types'

/**
 * Products for the public site.
 * - Supabase not configured: the built-in list, ready immediately.
 * - Supabase configured: `loading` until it answers, then its rows (even if empty).
 *   If the request itself fails, the built-in list is used so the page is never blank.
 */
export function useProducts() {
  const [state, setState] = useState<{ products: Product[]; loading: boolean }>(
    supabase ? { products: [], loading: true } : { products: fallbackProducts, loading: false },
  )

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    fetchProducts().then((rows) => {
      if (!cancelled) setState({ products: rows ?? fallbackProducts, loading: false })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function usePowerBankProject() {
  const [project, setProject] = useState<Project>(fallbackPowerBankProject)

  useEffect(() => {
    let cancelled = false
    fetchProject(fallbackPowerBankProject.slug).then((row) => {
      if (!cancelled && row) setProject(row)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return project
}
