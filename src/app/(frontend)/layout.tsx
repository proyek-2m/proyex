import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Suspense, type ReactNode } from 'react'

import RouteProgressbar from '$components/RouteProgressbar'
import theme from '$modules/theme-mantine'

import '$styles/global.css'
import '@mantine/carousel/styles.css'

const fontBody = Plus_Jakarta_Sans({
	variable: '--font-sans',
	adjustFontFallback: true,
	display: 'swap',
	subsets: ['latin', 'latin-ext', 'cyrillic-ext', 'vietnamese'],
	fallback: [
		'ui-sans-serif',
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Helvetica Neue',
		'Arial',
		'Noto Sans',
		'sans-serif',
		'Apple Color Emoji, Segoe UI Emoji',
		'Segoe UI Symbol',
		'Noto Color Emoji',
	],
})

export const metadata: Metadata = {
	icons: '/favicon.jpg',
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			{...mantineHtmlProps}
			lang="id"
			className={fontBody.variable}
		>
			<head>
				<ColorSchemeScript />
				<meta
					name="dicoding:email"
					content="gn.mailwork@gmail.com"
				/>
			</head>
			<body>
				<MantineProvider theme={theme}>
					<Suspense>
						<RouteProgressbar />
					</Suspense>
					{children}
				</MantineProvider>
				<SpeedInsights />
			</body>
		</html>
	)
}
