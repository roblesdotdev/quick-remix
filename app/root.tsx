import { type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node'
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
import { useToast } from './components/toaster'
import { AppToaster } from './components/ui/sonner'
import { ToggleTheme, useTheme } from './routes/actions+/toggle-theme'
import { ClientHintCheck, getHints } from './utils/client-hints'
import { getPublicEnv } from './utils/env.server'
import { combineHeaders } from './utils/misc'
import { useNonce } from './utils/nonce-provider'
import { type Theme, parseTheme } from './utils/theme.server'
import { getToast } from './utils/toast.server'
import icon from '~/assets/favicon.svg'
import { href as iconsHref } from '~/components/ui/icon'

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image+svg', href: icon },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers: toastHeaders } = await getToast(request)
  return json(
    {
      ENV: getPublicEnv(),
      toast,
      requestInfo: {
        hints: getHints(request),
        userPrefs: {
          theme: parseTheme(request),
        },
      },
    },
    {
      headers: combineHeaders(toastHeaders),
    },
  )
}

export function Document({
  children,
  theme = 'dark',
  nonce,
  env = {},
}: {
  children: React.ReactNode
  nonce: string
  theme?: Theme
  env?: Record<string, string>
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
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
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
  useToast(data.toast)

  return (
    <Document theme={theme} nonce={nonce} env={data.ENV}>
      <header className="h-14 px-4">
        <div className="container mx-auto flex h-full items-center justify-between">
          <Link to="/">Quick Remix</Link>
          <ToggleTheme userPreference={data.requestInfo.userPrefs.theme} />
        </div>
      </header>
      <div className="px-4">
        <Outlet />
        <img
          src={iconsHref}
          alt=""
          hidden
          // @ts-expect-error -- silly React pretending this attribute doesn't exist
          // eslint-disable-next-line
          fetchpriority="high"
        />
        <div className="h-[100vh]" />
      </div>
      <AppToaster theme={theme} position="bottom-right" closeButton />
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
