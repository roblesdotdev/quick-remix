import { type LoaderFunctionArgs } from '@remix-run/node'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react'
import '~/styles/global.css'
import { GeneralErrorBoundary } from './components/error-boundary'
import { ToggleTheme, useTheme } from './routes/actions+/toggle-theme'
import { ClientHintCheck, getHints } from './utils/client-hints'
import { useNonce } from './utils/nonce-provider'
import { type Theme, parseTheme } from './utils/theme.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: parseTheme(request),
      },
    },
  })
}

export function Document({
  children,
  theme = 'dark',
  nonce,
}: {
  children: React.ReactNode
  nonce: string
  theme?: Theme
}) {
  return (
    <html lang="en" className={`${theme}`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  const theme = useTheme()
  const nonce = useNonce()

  return (
    <Document theme={theme} nonce={nonce}>
      <header className="h-14 px-4">
        <div className="container mx-auto flex h-full items-center justify-between">
          <Link to="/">Quick Remix</Link>
          <ToggleTheme userPreference={data.requestInfo.userPrefs.theme} />
        </div>
      </header>
      <div className="px-4">
        <Outlet />
        <div className="h-[100vh]" />
      </div>
    </Document>
  )
}

export function ErrorBoundary() {
  const nonce = useNonce()
  return (
    <Document nonce={nonce}>
      <GeneralErrorBoundary />
    </Document>
  )
}
