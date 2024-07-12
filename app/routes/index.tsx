import { type MetaFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { Icon } from '~/components/ui/icon'
import { redirectWithToast } from '~/utils/toast.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'Quick Remix' },
    { name: 'description', content: 'Welcome to Quick Remix!' },
  ]
}

export async function action() {
  return redirectWithToast('/', {
    type: 'success',
    title: 'Success',
    description: 'This is a toast description',
  })
}

export default function Index() {
  return (
    <div className="container mx-auto py-12 font-sans">
      <h1 className="text-3xl">Quick Remix</h1>

      <div className="py-4">
        <Icon name="github-logo" className="h-5 w-5" />
      </div>
      <div className="py-4">
        <Form method="POST">
          <button>Show toast</button>
        </Form>
      </div>
    </div>
  )
}
