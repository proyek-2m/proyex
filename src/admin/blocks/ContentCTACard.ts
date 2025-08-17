import type { Block } from 'payload'

import { ButtonBlock } from '$payload-blocks/Button'
import { styleField } from '$payload-fields/style'

export const ContentCTACardBlock: Block = {
	slug: 'contentCtaCard',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cccb'
		}

		return 'cccb'
	},
	imageURL: '/blocks/content-cta-card.jpg',
	fields: [
		{
			name: 'content',
			type: 'richText',
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_cccba'
				}

				return 'cccba'
			},
			name: 'actions',
			minRows: 1,
			fields: ButtonBlock.fields,
		},
		styleField({
			backgroundColor: true,
			rounded: true,
			textColor: true,
		}),
	],
}
