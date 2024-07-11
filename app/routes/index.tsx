import { type LinksFunction, type MetaFunction } from '@remix-run/node'
import icon from '~/assets/favicon.svg'
import { Icon } from '~/components/ui/icon'

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image+svg', href: icon },
]

export const meta: MetaFunction = () => {
  return [
    { title: 'Quick Remix' },
    { name: 'description', content: 'Welcome to Quick Remix!' },
  ]
}

export default function Index() {
  return (
    <div className="container mx-auto py-12 font-sans">
      <h1 className="text-3xl">Quick Remix</h1>

      <div className="py-4">
        <Icon name="github-logo" className="h-5 w-5" />
      </div>
    </div>
  )
}
