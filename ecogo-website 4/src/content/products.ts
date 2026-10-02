import type { Product } from '@/lib/types'

/**
 * Fallback catalogue, shown when Supabase is not configured or has no published rows.
 * It mirrors supabase/seed.sql. Once the database is live, edit products there and this
 * file simply stays as a safety net.
 *
 * Wording is general on purpose. Confirm each item matches what Ecogo actually stocks.
 */
export const fallbackProducts: Product[] = [
  {
    id: 'solar-lighting',
    slug: 'solar-lighting',
    name: 'Solar lighting',
    category: 'Solar and energy',
    summary: 'Lighting that charges from the sun, for homes, shops and outdoor spaces.',
    priceKes: null,
    features: ['Charges from sunlight', 'No electricity bill for lighting', 'Portable and easy to install'],
    useCase: 'Homes, shops and market stalls that need reliable light when the grid is unavailable.',
    status: 'available',
    visualKey: 'solar-lamp',
    imageUrl: null,
    ctaLabel: 'Ask about solar lighting',
  },
  {
    id: 'security-cameras',
    slug: 'security-cameras',
    name: 'Security cameras',
    category: 'Security and monitoring',
    summary: 'Cameras for keeping an eye on a shop, home or yard.',
    priceKes: null,
    features: ['Indoor and outdoor options', 'Check footage from your phone', 'Suitable for small businesses'],
    useCase: 'Shops, stores and homes that want to see what is happening while they are away.',
    status: 'available',
    visualKey: 'camera',
    imageUrl: null,
    ctaLabel: 'Ask about cameras',
  },
  {
    id: 'memory-and-accessories',
    slug: 'memory-and-accessories',
    name: 'Memory cards and accessories',
    category: 'Consumer electronics',
    summary: 'Everyday electronics accessories, from storage to cables and chargers.',
    priceKes: null,
    features: ['Storage for phones, cameras and devices', 'Charging and connection accessories', 'Sold in Kenya shillings'],
    useCase: 'Anyone who needs to store more, charge faster or connect their devices.',
    status: 'available',
    visualKey: 'memory-card',
    imageUrl: null,
    ctaLabel: 'Ask about accessories',
  },
  {
    id: 'shared-power-banks',
    slug: 'shared-power-banks',
    name: 'Shared power banks',
    category: 'Portable power',
    summary: 'Borrow a power bank at one station and return it at another. Currently in development.',
    priceKes: null,
    features: [
      'Pick up and return at compatible stations',
      'Designed for short, everyday top-ups',
      'Payment by mobile money is planned',
    ],
    useCase: 'Anyone out and about whose phone is running low.',
    status: 'in_development',
    visualKey: 'power-bank',
    imageUrl: null,
    ctaLabel: 'See the project',
  },
]
