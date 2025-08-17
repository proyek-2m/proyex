import type { Field } from 'payload'

import { linkField } from '$payload-fields/link'
import { slugField } from '$payload-fields/slug'

export const metafield = (fields?: { general?: Field[]; info?: Field[] }): Field[] => [
	{
		type: 'tabs',
		admin: {
			position: 'sidebar',
		},
		tabs: [
			{
				label: 'General',
				fields: [
					{
						name: 'title',
						type: 'text',
						required: true,
					},
					slugField,
					linkField,
					{
						name: 'excerpt',
						type: 'textarea',
					},
					{
						name: 'featuredImage',
						type: 'upload',
						relationTo: 'asset',
					},
					...(fields?.general ?? []),
				],
			},
			{
				label: 'Info',
				fields: [
					...(fields?.info ?? []),
					{
						name: 'publishedAt',
						type: 'date',
						admin: {
							date: {
								pickerAppearance: 'dayAndTime',
							},
						},
					},
					{
						name: 'author',
						type: 'relationship',
						relationTo: 'users',
						defaultValue: ({ req }) => {
							if (req?.user) {
								return req.user.id
							}

							return undefined
						},
					},
				],
			},
		],
	},
]
