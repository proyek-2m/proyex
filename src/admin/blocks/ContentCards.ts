import type { Block } from 'payload'

import { ButtonBlock } from '$payload-blocks/Button'
import { styleField, textColorField } from '$payload-fields/style'

export const ContentCardsBlock: Block = {
	slug: 'contentCards',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_ccsb'
		}

		return 'ccsb'
	},
	imageURL: '/blocks/content-cards.jpg',
	fields: [
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_ccsbi'
				}

				return 'ccsbi'
			},
			name: 'items',
			minRows: 1,
			fields: [
				{
					type: 'text',
					name: 'icon',
					admin: {
						width: '50%',
						description: 'Fill with name of icon from https://lucide.dev/icons',
					},
				},
				{
					name: 'content',
					type: 'richText',
				},
				{
					type: 'array',
					dbName: (args) => {
						if (args.tableName) {
							return args.tableName + '_ccsbia'
						}

						return 'ccsbia'
					},
					name: 'actions',
					minRows: 1,
					fields: ButtonBlock.fields,
				},
			],
		},
		styleField({
			backgroundColor: true,
			rounded: true,
			gap: true,
			textColor: true,
			prefixFields: [
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
				textColorField({
					name: 'iconColor',
				}),
			],
		}),
	],
}
