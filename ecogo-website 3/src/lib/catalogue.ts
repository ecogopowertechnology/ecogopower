import { supabase } from './supabase'
import type { Product, Project, ProductStatus, ProjectStatus } from './types'

interface ProductRow {
  id: string
  slug: string
  name: string
  category: string
  summary: string
  features: string[] | null
  use_case: string | null
  status: ProductStatus
  visual_key: string | null
  image_url: string | null
  cta_label: string
}

interface ProjectRow {
  id: string
  slug: string
  name: string
  summary: string
  status: ProjectStatus
  launch_note: string | null
}

const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  summary: r.summary,
  features: r.features ?? [],
  useCase: r.use_case,
  status: r.status,
  visualKey: r.visual_key,
  imageUrl: r.image_url,
  ctaLabel: r.cta_label,
})

const toProject = (r: ProjectRow): Project => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  summary: r.summary,
  status: r.status,
  launchNote: r.launch_note,
})

/** Returns null when Supabase is unavailable or empty, so callers can fall back to static content. */
export async function fetchProducts(): Promise<Product[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, category, summary, features, use_case, status, visual_key, image_url, cta_label')
    .order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return null
  return (data as ProductRow[]).map(toProduct)
}

export async function fetchProject(slug: string): Promise<Project | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, name, summary, status, launch_note')
    .eq('slug', slug)
    .maybeSingle()
  if (error || !data) return null
  return toProject(data as ProjectRow)
}
