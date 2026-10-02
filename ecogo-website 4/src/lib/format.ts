/** Formats a whole-shilling price, e.g. 1500 -> "KSh 1,500". */
export const formatKes = (amount: number): string => `KSh ${amount.toLocaleString('en-KE')}`

/** URL-safe slug from a product name. */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'product'
}
