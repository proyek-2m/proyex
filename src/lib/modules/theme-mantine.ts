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
			'#fff6e0',
			'#ffecca',
			'#ffd799',
			'#ffc164',
			'#feaa2b',
			'#fea319',
			'#fe9d05',
			'#e38800',
			'#ca7800',
			'#b06700',
		],
		secondary: [
			'#edf3fc',
			'#d8e2f4',
			'#adc3eb',
			'#7fa2e3',
			'#5a87dc',
			'#4475d9',
			'#386cd8',
			'#2c5cc0',
			'#2351ac',
			'#133e87',
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
