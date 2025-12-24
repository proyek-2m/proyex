'use client'
import { createTheme, Text } from '@mantine/core'

const theme = createTheme({
	breakpoints: {
		xs: '375px',
		sm: '600px',
		md: '901px',
		lg: '1200px',
		xl: '1600px',
	},
	fontFamily: 'var(--font-sans)',
	headings: {
		fontFamily: 'var(--font-title)',
		fontWeight: '700',
		sizes: {
			h1: {
				fontSize: 'var(--title-h1)',
				lineHeight: '1.1',
			},
			h2: {
				fontSize: 'var(--title-h2)',
				lineHeight: '1.2',
			},
			h3: {
				fontSize: 'var(--title-h3)',
				lineHeight: '1.2',
			},
			h4: {
				fontSize: 'var(--title-h4)',
				lineHeight: '1.2',
			},
			h5: {
				fontSize: 'var(--title-h5)',
				lineHeight: '1.3',
			},
			h6: {
				fontSize: 'var(--title-h6)',
				lineHeight: '1.3',
			},
		},
	},
	defaultRadius: 'md',
	radius: {
		xs: '2px',
		sm: '4px',
		md: '8px',
		lg: '16px',
		xl: '24px',
		'2xl': '32px',
		'3xl': '56px',
		'4xl': '64px',
		full: '99999px',
	},
	primaryColor: 'primary',
	black: '#1a1a1c',
	colors: {
		primary: [
			'#ffeaf3',
			'#fcd4e1',
			'#f4a7bf',
			'#ec779c',
			'#e64f7e',
			'#e3366c',
			'#e22862',
			'#c91a52',
			'#b41148',
			'#9f003e',
		],
		secondary: [
			'#ecf4ff',
			'#dce4f5',
			'#b9c7e2',
			'#94a8d0',
			'#748dc0',
			'#5f7cb7',
			'#5474b4',
			'#44639f',
			'#3a5890',
			'#2c4b80',
		],
	},
	components: {
		Text: Text.extend({
			defaultProps: {
				lh: 'xl',
			},
		}),
	},
})

export default theme
