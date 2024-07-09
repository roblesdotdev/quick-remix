import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Quick Remix' },
    { name: 'description', content: 'Welcome to Quick Remix!' },
  ]
}

export default function Index() {
  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Quick Remix</h1>
    </div>
  )
}
