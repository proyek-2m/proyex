/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		'@tailwindcss/postcss': {},
		autoprefixer: {},
		'postcss-preset-mantine': {},
		'postcss-simple-vars': {
			variables: {
				'mantine-breakpoint-xs': '375px',
				'mantine-breakpoint-sm': '600px',
				'mantine-breakpoint-md': '901px',
				'mantine-breakpoint-lg': '1200px',
				'mantine-breakpoint-xl': '1600px',
			},
		},
	},
}

export default config
