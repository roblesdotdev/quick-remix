export async function loader() {
  throw new Response('Not found', { status: 404 })
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Not found page</h1>
    </div>
  )
}
