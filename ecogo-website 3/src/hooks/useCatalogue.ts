import { useEffect, useState } from 'react'
import { fetchProducts, fetchProject } from '@/lib/catalogue'
import { fallbackProducts } from '@/content/products'
import { fallbackPowerBankProject } from '@/content/project'
import type { Product, Project } from '@/lib/types'

/** Shows fallback content immediately, then swaps in live data if Supabase returns any. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)

  useEffect(() => {
    let cancelled = false
    fetchProducts().then((rows) => {
      if (!cancelled && rows) setProducts(rows)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return products
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
