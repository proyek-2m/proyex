import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const CardFormBlock: Block = {
	slug: 'cardForm',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cfb'
		}

		return 'cfb'
	},
	imageURL: '/blocks/card-form.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
		},
		{
			name: 'form',
			type: 'relationship',
			relationTo: 'forms',
		},
		styleField({
			padding: true,
			rounded: true,
		}),
	],
}
