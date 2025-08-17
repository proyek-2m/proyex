'use client'
import { nprogress } from '@mantine/nprogress'
import { usePathname, useRouter as useRouterOriginal } from 'next/navigation'

export function useRouter(): ReturnType<typeof useRouterOriginal> {
	const router = useRouterOriginal()
	const pathname = usePathname()

	return {
		...router,
		push: (href, options) => {
			if (pathname !== href) {
				nprogress.start()
			}

			router.push(href, options)
		},
		replace: (href, options) => {
			if (pathname !== href) {
				nprogress.start()
			}

			router.replace(href, options)
		},
	}
}
