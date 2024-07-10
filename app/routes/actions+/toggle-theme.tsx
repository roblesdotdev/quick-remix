import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { type ActionFunctionArgs } from '@remix-run/node'
import { json, useFetcher, useFetchers } from '@remix-run/react'
import { z } from 'zod'
import { useHints } from '~/utils/client-hints'
import { safeRedirect } from '~/utils/http.server'
import { invariantResponse } from '~/utils/misc'
import { useCurrentPath, useRequestInfo } from '~/utils/request-info'
import { type Theme, serializeTheme } from '~/utils/theme.server'

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  redirectTo: z.string().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, {
    schema: ThemeFormSchema,
  })
  invariantResponse(submission.status === 'success', 'Invalid theme provided')

  const { theme, redirectTo } = submission.value

  const responseInit = {
    headers: {
      'Set-Cookie': serializeTheme(theme),
    },
  }
  if (redirectTo) {
    return safeRedirect(redirectTo, responseInit)
  }
  return json({ result: submission.reply() }, responseInit)
}

export function ToggleTheme({
  userPreference,
}: {
  userPreference?: Theme | null
}) {
  const fetcher = useFetcher<typeof action>()
  const [form] = useForm({
    id: 'toggle-theme',
    lastResult: fetcher.data?.result,
  })
  const currentPath = useCurrentPath()

  const optimisticTheme = useOptimisticTheme()
  const theme = optimisticTheme ?? userPreference ?? 'system'

  return (
    <fetcher.Form
      {...getFormProps(form)}
      action="/actions/toggle-theme"
      method="POST"
      onChange={e => {
        fetcher.submit(e.currentTarget, {
          method: 'POST',
          action: '/actions/toggle-theme',
        })
      }}
    >
      <input type="hidden" name="redirectTo" value={currentPath} />
      <select name="theme" defaultValue={theme} className="bg-black text-white">
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </fetcher.Form>
  )
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticTheme() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find(
    f => f.formAction === '/actions/toggle-theme',
  )

  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema,
    })

    if (submission.status === 'success') {
      return submission.value.theme
    }
  }
}

export function useTheme(): Theme {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticTheme()
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode
  }
  return requestInfo.userPrefs.theme ?? hints.theme
}
