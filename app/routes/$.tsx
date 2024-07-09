import { Link, type MetaFunction, useLocation } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundary'

export const meta: MetaFunction = ({ location }) => {
  return [{ title: `Not found ${location.pathname}` }]
}

export async function loader() {
  throw new Response('Not found', { status: 404 })
}

function NotFound() {
  const location = useLocation()
  return (
    <div>
      <div>
        <h1>Can't find this page:</h1>
        <pre>{location.pathname}</pre>
      </div>
      <Link to="/">Back to home</Link>
    </div>
  )
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => <NotFound />,
      }}
    />
  )
}
