import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import tailwindStyles from '~/styles/tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Stack',
  description: 'Remix Stack',
  viewport: 'width=device-width,initial-scale=1',
})

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
