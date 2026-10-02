import type { Project } from '@/lib/types'

/** The stages a project moves through, in order. Mirrors the `status` check constraint on `projects`. */
export const projectStages = [
  { key: 'concept', label: 'Concept', note: 'The idea and the problem it solves.' },
  { key: 'pilot_preparation', label: 'Pilot preparation', note: 'Hardware, payments and first locations being prepared.' },
  { key: 'pilot', label: 'Pilot', note: 'A small live trial to learn from real use.' },
  { key: 'rollout', label: 'Rollout', note: 'Growing to more stations and areas.' },
  { key: 'live', label: 'Live', note: 'Operating as a regular service.' },
] as const

/**
 * Fallback for the power bank project when Supabase is not configured.
 * Update the real status in the `projects` table; do not claim a stage that has not been reached.
 */
export const fallbackPowerBankProject: Project = {
  id: 'shared-power-banks',
  slug: 'shared-power-banks',
  name: 'Shared power bank network',
  summary:
    'A network of stations where people borrow a power bank when they need it and return it at any compatible station.',
  status: 'pilot_preparation',
  launchNote: null, // add a date only once one is confirmed, e.g. 'Pilot planned for [month, year]'
}
