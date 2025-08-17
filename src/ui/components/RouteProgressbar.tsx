'use client'
import { useShallowEffect } from '@mantine/hooks'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { usePathname, useSearchParams } from 'next/navigation'

import { isServer } from '$utils/common'
import '@mantine/nprogress/styles.css'

export default function RouteProgressbar() {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useShallowEffect(() => {
		if (isServer() === false) {
			window.scrollTo(0, 0)
		}

		nprogress.complete()
	}, [pathname, searchParams])

	return <NavigationProgress />
}
