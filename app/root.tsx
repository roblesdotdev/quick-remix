import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import tailwindStyles from '~/styles/tailwind.css'
import { getUserById } from './utils/auth.server'
import { getSession, getSessionUser } from './utils/session.server'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Stack',
  description: 'Remix Stack',
  viewport: 'width=device-width,initial-scale=1',
})

type UserResponse = Awaited<ReturnType<typeof getUserById>>

export type RootLoaderData = {
  user?: UserResponse | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getSessionUser(request)
  const { signOut } = await getSession(request)
  let user: UserResponse = null
  if (userId) {
    user = await getUserById(userId)
    if (!user) {
      await signOut()
    }
  }

  return json<RootLoaderData>({ user })
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
