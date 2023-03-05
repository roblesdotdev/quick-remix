import { Form, Link } from '@remix-run/react'
import { useOptionalUser } from '~/utils/misc'

export default function Index() {
  const user = useOptionalUser()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-xl font-bold">
        Welcome{' '}
        <span className="font-bold">{user ? user.username : 'Guest'}</span>
      </h1>
      <div>
        {user ? (
          <Form method="post" action="/logout">
            <button type="submit">Logout</button>
          </Form>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  )
}
