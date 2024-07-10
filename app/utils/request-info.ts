import { useLocation, useRouteLoaderData } from '@remix-run/react'
import { invariant } from './misc'
import { type loader as rootLoader } from '~/root'

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
  const data = useRouteLoaderData<typeof rootLoader>('root')
  invariant(data?.requestInfo, 'No requestInfo found in root loader')

  return data.requestInfo
}

export function useCurrentPath() {
  const location = useLocation()
  return location.pathname + location.search
}
