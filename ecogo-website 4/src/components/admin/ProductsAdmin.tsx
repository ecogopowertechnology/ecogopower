import { useCallback, useEffect, useState } from 'react'
import { listAllProducts, type AdminProduct } from '@/lib/admin'
import { formatKes } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ImageIcon, PlusIcon } from '@/components/ui/Icons'
import { ProductForm } from './ProductForm'

export function ProductsAdmin() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<AdminProduct | 'new' | null>(null)

  const load = useCallback(async () => {
    try {
      setProducts(await listAllProducts())
      setError('')
    } catch (e) {
      console.error(e)
      setError('Could not load products. Check that the database setup (0002_shop_and_admin.sql) has been run.')
    }
  }, [])

  useEffect(() => { void load() }, [load])

  if (editing) {
    const categories = Array.from(new Set((products ?? []).map((p) => p.category)))
    return (
      <ProductForm
        product={editing === 'new' ? null : editing}
        categories={categories}
        onCancel={() => setEditing(null)}
        onDone={() => { setEditing(null); void load() }}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-slate-ink">{products ? `${products.length} product${products.length === 1 ? '' : 's'}` : 'Loading'}</p>
        <Button type="button" onClick={() => setEditing('new')}>
          <PlusIcon className="mr-2" width={20} height={20} /> Add a product
        </Button>
      </div>

      {error && <p role="alert" className="mt-6 rounded-[var(--radius-control)] bg-clay-600/10 p-4 font-medium text-clay-600">{error}</p>}

      <ul className="mt-6 divide-y divide-mist-300 rounded-[var(--radius-panel)] bg-white ring-1 ring-mist-300">
        {(products ?? []).map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => setEditing(p)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-mist-100">
              <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mist-200 text-slate-ink">
                {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-full w-full object-cover" /> : <ImageIcon width={26} height={26} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{p.name}</span>
                <span className="block text-sm text-slate-ink">{p.category}</span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold">{p.priceKes !== null ? formatKes(p.priceKes) : 'No price'}</span>
                  <StatusBadge status={p.status} />
                  {!p.isPublished && <span className="rounded-full bg-mist-300 px-3 py-1 text-sm font-semibold">Hidden</span>}
                </span>
              </span>
              <span className="shrink-0 font-semibold text-brand-blue">Edit</span>
            </button>
          </li>
        ))}
        {products && products.length === 0 && <li className="p-6 text-slate-ink">No products yet. Add your first one.</li>}
      </ul>
    </div>
  )
}
