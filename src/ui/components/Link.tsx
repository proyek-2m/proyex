'use client'
import { nprogress } from '@mantine/nprogress'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

export default function Link(props: ComponentProps<typeof NextLink>) {
	const pathname = usePathname()

	return (
		<NextLink
			{...props}
			prefetch={false}
			onNavigate={(e) => {
				if (pathname !== props.href) {
					nprogress.start()
				}

				props.onNavigate?.(e)
			}}
		/>
	)
}
