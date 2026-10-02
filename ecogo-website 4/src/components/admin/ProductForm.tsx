import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { createProduct, deleteProduct, removeProductImage, updateProduct, uploadProductImage, type AdminProduct } from '@/lib/admin'
import type { ProductStatus } from '@/lib/types'
import { Field, inputClass } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { ImageIcon, TrashIcon } from '@/components/ui/Icons'

const statuses: { value: ProductStatus; label: string }[] = [
  { value: 'available', label: 'Available now' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'coming_soon', label: 'Coming soon' },
  { value: 'in_development', label: 'In development' },
]

interface Props {
  product: AdminProduct | null // null = adding a new product
  categories: string[]
  onDone: () => void
  onCancel: () => void
}

export function ProductForm({ product, categories, onDone, onCancel }: Props) {
  const uid = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(product?.name ?? '')
  const [category, setCategory] = useState(product?.category ?? '')
  const [summary, setSummary] = useState(product?.summary ?? '')
  const [price, setPrice] = useState(product?.priceKes != null ? String(product.priceKes) : '')
  const [features, setFeatures] = useState((product?.features ?? []).join('\n'))
  const [useCase, setUseCase] = useState(product?.useCase ?? '')
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'available')
  const [published, setPublished] = useState(product?.isPublished ?? true)
  const [sortOrder, setSortOrder] = useState(String(product?.sortOrder ?? 100))
  const [imageUrl, setImageUrl] = useState<string | null>(product?.imageUrl ?? null)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const preview = useMemo(() => (newFile ? URL.createObjectURL(newFile) : imageUrl), [newFile, imageUrl])

  // Accept the way people naturally type prices: 1,500 or KSh 1500.
  const cleanPrice = price.replace(/ksh|kes/gi, '').replace(/[,\s]/g, '')

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Enter the product name.'
    if (!category.trim()) e.category = 'Enter a category, for example "Solar and energy".'
    if (!summary.trim()) e.summary = 'Write a short description.'
    if (cleanPrice !== '' && !/^\d+$/.test(cleanPrice)) e.price = 'Enter whole shillings, for example 1500. Leave empty to show "Message us for the price".'
    if (!/^\d+$/.test(sortOrder.trim())) e.sortOrder = 'Enter a whole number.'
    return e
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setBusy(true)
    setFormError('')
    try {
      let finalUrl = imageUrl
      const oldUrl = product?.imageUrl ?? null
      if (newFile) finalUrl = await uploadProductImage(newFile)

      const input = {
        name: name.trim(),
        category: category.trim(),
        summary: summary.trim(),
        priceKes: cleanPrice === '' ? null : Number(cleanPrice),
        features: features.split('\n').map((l) => l.trim()).filter(Boolean),
        useCase,
        status,
        imageUrl: finalUrl,
        isPublished: published,
        sortOrder: Number(sortOrder.trim()),
      }
      if (product) await updateProduct(product.id, input)
      else await createProduct(input)

      // Tidy up the old photo only after the product was saved successfully.
      if (oldUrl && oldUrl !== finalUrl) void removeProductImage(oldUrl)
      onDone()
    } catch (err) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setFormError(`Could not save: ${msg}`)
    } finally {
      setBusy(false)
    }
  }

  async function onDelete() {
    if (!product) return
    if (!window.confirm(`Delete "${product.name}" permanently? This cannot be undone.`)) return
    setBusy(true)
    try {
      await deleteProduct(product.id)
      void removeProductImage(product.imageUrl)
      onDone()
    } catch (err) {
      setFormError(`Could not delete: ${err instanceof Error ? err.message : 'Something went wrong.'}`)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <h2 className="t-h2 !text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)]">{product ? 'Edit product' : 'Add a product'}</h2>

      {/* Photo */}
      <div>
        <p className="mb-1.5 text-base font-semibold">Photo</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex aspect-[4/3] w-full max-w-xs items-center justify-center overflow-hidden rounded-[1.1rem] bg-mist-200 text-slate-ink">
            {preview ? <img src={preview} alt="Product preview" className="h-full w-full object-cover" /> : <ImageIcon width={40} height={40} />}
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileRef}
              id={`${uid}-file`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
            />
            <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
              {preview ? 'Change photo' : 'Choose photo'}
            </Button>
            {preview && (
              <Button type="button" variant="secondary" onClick={() => { setNewFile(null); setImageUrl(null); if (fileRef.current) fileRef.current.value = '' }}>
                Remove photo
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-ink">A clear photo on a plain background works best. It is resized automatically before upload.</p>
      </div>

      <Field id={`${uid}-name`} label="Product name" error={errors.name}>
        {(aria) => <input id={`${uid}-name`} className={inputClass} value={name} onChange={(e) => setName(e.target.value)} {...aria} />}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-category`} label="Category" error={errors.category} hint="Pick an existing one or type a new one. Customers can filter by category.">
          {(aria) => (
            <>
              <input id={`${uid}-category`} list={`${uid}-categories`} className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} {...aria} />
              <datalist id={`${uid}-categories`}>
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </>
          )}
        </Field>
        <Field id={`${uid}-price`} label="Price in Kenya shillings" optional error={errors.price} hint="Numbers only, for example 1500.">
          {(aria) => <input id={`${uid}-price`} inputMode="numeric" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} {...aria} />}
        </Field>
      </div>

      <Field id={`${uid}-summary`} label="Short description" error={errors.summary}>
        {(aria) => <textarea id={`${uid}-summary`} rows={3} className={`${inputClass} resize-y`} value={summary} onChange={(e) => setSummary(e.target.value)} {...aria} />}
      </Field>

      <Field id={`${uid}-features`} label="Key features" optional hint="One feature per line.">
        {(aria) => <textarea id={`${uid}-features`} rows={4} className={`${inputClass} resize-y`} value={features} onChange={(e) => setFeatures(e.target.value)} {...aria} />}
      </Field>

      <Field id={`${uid}-usecase`} label="Best for" optional hint="Who or what it is useful for.">
        {(aria) => <input id={`${uid}-usecase`} className={inputClass} value={useCase} onChange={(e) => setUseCase(e.target.value)} {...aria} />}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-status`} label="Availability">
          {(aria) => (
            <select id={`${uid}-status`} className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} {...aria}>
              {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
        </Field>
        <Field id={`${uid}-order`} label="Display order" error={errors.sortOrder} hint="Lower numbers appear first. Leave at 100 to list newest first.">
          {(aria) => <input id={`${uid}-order`} inputMode="numeric" className={inputClass} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} {...aria} />}
        </Field>
      </div>

      <label className="flex min-h-12 items-center gap-3 text-base font-semibold">
        <input type="checkbox" className="size-5 accent-[var(--color-brand-blue)]" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Show this product on the website
      </label>

      {formError && (
        <p role="alert" className="rounded-[var(--radius-control)] bg-clay-600/10 p-4 font-medium text-clay-600">{formError}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save product'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        {product && (
          <button type="button" onClick={onDelete} disabled={busy} className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] px-4 font-semibold text-clay-600 hover:bg-clay-600/10 disabled:opacity-60">
            <TrashIcon width={20} height={20} /> Delete
          </button>
        )}
      </div>
    </form>
  )
}
