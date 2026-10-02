import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { PRODUCT_COLUMNS } from './catalogue'
import { prepareImage } from './image'
import { slugify } from './format'
import type { Product, ProductStatus } from './types'

const BUCKET = 'product-images'

export const isAdmin = (session: Session | null): boolean => session?.user?.app_metadata?.role === 'admin'

function client() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

export interface AdminProduct extends Product {
  isPublished: boolean
  sortOrder: number
}

interface Row {
  id: string
  slug: string
  name: string
  category: string
  summary: string
  price_kes: number | null
  features: string[] | null
  use_case: string | null
  status: ProductStatus
  visual_key: string | null
  image_url: string | null
  cta_label: string
  is_published: boolean
  sort_order: number
}

const fromRow = (r: Row): AdminProduct => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  summary: r.summary,
  priceKes: r.price_kes,
  features: r.features ?? [],
  useCase: r.use_case,
  status: r.status,
  visualKey: r.visual_key,
  imageUrl: r.image_url,
  ctaLabel: r.cta_label,
  isPublished: r.is_published,
  sortOrder: r.sort_order,
})

export async function listAllProducts(): Promise<AdminProduct[]> {
  const { data, error } = await client()
    .from('products')
    .select(`${PRODUCT_COLUMNS}, is_published, sort_order`)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Row[]).map(fromRow)
}

export interface ProductInput {
  name: string
  category: string
  summary: string
  priceKes: number | null
  features: string[]
  useCase: string
  status: ProductStatus
  imageUrl: string | null
  isPublished: boolean
  sortOrder: number
}

const toColumns = (p: ProductInput) => ({
  name: p.name,
  category: p.category,
  summary: p.summary,
  price_kes: p.priceKes,
  features: p.features,
  use_case: p.useCase.trim() === '' ? null : p.useCase.trim(),
  status: p.status,
  image_url: p.imageUrl,
  is_published: p.isPublished,
  sort_order: p.sortOrder,
})

export async function createProduct(input: ProductInput): Promise<void> {
  const base = slugify(input.name)
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`
    const { error } = await client().from('products').insert({ ...toColumns(input), slug })
    if (!error) return
    if (error.code !== '23505') throw error // anything except "slug already taken"
  }
  throw new Error('Could not create a unique web address for this product. Try a slightly different name.')
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { error } = await client().from('products').update(toColumns(input)).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await client().from('products').delete().eq('id', id)
  if (error) throw error
}

/** Resizes and uploads a product photo, returning its public address. */
export async function uploadProductImage(file: File): Promise<string> {
  const { blob, ext } = await prepareImage(file)
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await client().storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: '31536000',
  })
  if (error) throw error
  return client().storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/** Deletes an uploaded image if the address points at our bucket. Failures are ignored on purpose. */
export async function removeProductImage(url: string | null): Promise<void> {
  if (!url) return
  const marker = `/${BUCKET}/`
  const i = url.indexOf(marker)
  if (i === -1) return
  const path = decodeURIComponent(url.slice(i + marker.length).split('?')[0])
  await client().storage.from(BUCKET).remove([path])
}

export type MessageStatus = 'new' | 'in_progress' | 'closed'

export interface ContactMessage {
  id: string
  createdAt: string
  name: string
  email: string
  phone: string | null
  organisation: string | null
  reason: string
  message: string
  sourcePage: string | null
  status: MessageStatus
}

export async function listMessages(): Promise<ContactMessage[]> {
  const { data, error } = await client()
    .from('contact_submissions')
    .select('id, created_at, name, email, phone, organisation, reason, message, source_page, status')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return (data as Array<Record<string, string | null>>).map((r) => ({
    id: r.id as string,
    createdAt: r.created_at as string,
    name: r.name as string,
    email: r.email as string,
    phone: r.phone,
    organisation: r.organisation,
    reason: r.reason as string,
    message: r.message as string,
    sourcePage: r.source_page,
    status: r.status as MessageStatus,
  }))
}

export async function setMessageStatus(id: string, status: MessageStatus): Promise<void> {
  const { error } = await client().from('contact_submissions').update({ status }).eq('id', id)
  if (error) throw error
}
