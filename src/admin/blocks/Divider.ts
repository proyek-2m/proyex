import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const DividerBlock: Block = {
	slug: 'divider',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_db'
		}

		return 'db'
	},
	imageURL: '/blocks/divider.jpg',
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'height',
					type: 'number',
					admin: {
						width: '50%',
					},
				},
				{
					type: 'text',
					name: 'icon',
					admin: {
						width: '50%',
						description: 'Fill with name of icon from https://lucide.dev/icons',
					},
				},
			],
		},
		styleField({
			textColor: true,
			textColorOptions: {
				name: 'color',
			},
		}),
	],
}
