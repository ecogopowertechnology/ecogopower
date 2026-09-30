import { usePageMeta } from '@/hooks/usePageMeta'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  usePageMeta({
    title: 'Page not found',
    description: 'This page could not be found on the Ecogo website.',
    path: '/404',
  })
  return (
    <Container className="py-28 md:py-40">
      <h1 className="t-h1 max-w-[14ch]">This page is not here</h1>
      <p className="t-lead mt-6 max-w-[40ch] text-slate-ink">
        The link may be old or mistyped. Try the home page or the solutions list.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button to="/">Go to the home page</Button>
        <Button to="/solutions" variant="secondary">
          View solutions
        </Button>
      </div>
    </Container>
  )
}
