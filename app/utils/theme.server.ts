import * as cookie from 'cookie'

export type Theme = 'light' | 'dark'

const cookieName = 'theme'

export function parseTheme(request: Request): Theme | null {
  const cookieHeader = request.headers.get('cookie')
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : 'light'
  if (parsed === 'light' || parsed === 'dark') return parsed
  return null
}

export function serializeTheme(theme: Theme | 'system') {
  if (theme === 'system') {
    return cookie.serialize(cookieName, '', { path: '/', maxAge: -1 })
  } else {
    return cookie.serialize(cookieName, theme, { path: '/', maxAge: 31536000 })
  }
}
