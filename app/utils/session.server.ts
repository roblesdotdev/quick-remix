import { createCookieSessionStorage } from '@remix-run/node'
import { getRequiredServerEnvVar } from './misc'

const SESSION_SECRET = getRequiredServerEnvVar('SESSION_SECRET')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function getSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const initialValue = await sessionStorage.commitSession(session)

  const commit = async () => {
    const currentValue = await sessionStorage.commitSession(session)
    return currentValue === initialValue ? null : currentValue
  }

  return {
    session,
    commit,
    getHeaders: async (headers: ResponseInit['headers'] = new Headers()) => {
      const value = await commit()
      if (!value) return headers
      if (headers instanceof Headers) {
        headers.append('Set-Cookie', value)
      } else if (Array.isArray(headers)) {
        headers.push(['Set-Cookie', value])
      } else {
        headers['Set-Cookie'] = value
      }
      return headers
    },
  }
}
