export type ProductStatus = 'available' | 'out_of_stock' | 'coming_soon' | 'in_development'

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  summary: string
  priceKes: number | null
  features: string[]
  useCase: string | null
  status: ProductStatus
  visualKey: string | null
  imageUrl: string | null
  ctaLabel: string
}

export type ProjectStatus = 'concept' | 'pilot_preparation' | 'pilot' | 'rollout' | 'live'

export interface Project {
  id: string
  slug: string
  name: string
  summary: string
  status: ProjectStatus
  launchNote: string | null
}

export type SubmitResult = { ok: true } | { ok: false; message: string }
