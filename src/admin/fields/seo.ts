import type { Field } from 'payload'

export const seoField: Field[] = [
	{
		name: 'schemaType',
		type: 'select',
		enumName: 'scmtyp',
		defaultValue: 'WebPage',
		admin: {
			condition: (data) => data.collection === 'page',
		},
		options: [
			{
				label: 'WebPage',
				value: 'WebPage',
			},
			{
				label: 'AboutPage',
				value: 'AboutPage',
			},
			{
				label: 'ContactPage',
				value: 'ContactPage',
			},
			{
				label: 'FAQPage',
				value: 'FAQPage',
			},
			{
				label: 'ProfilePage',
				value: 'ProfilePage',
			},
			{
				label: 'SearchResultsPage',
				value: 'SearchResultsPage',
			},
		],
	},
	{
		name: 'robots',
		type: 'text',
	},
	{
		name: 'keywords',
		type: 'text',
	},
]
