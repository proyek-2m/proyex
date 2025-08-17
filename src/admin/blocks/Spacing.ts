import type { Block } from 'payload'

export const SpacingBlock: Block = {
	slug: 'spacing',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_spc'
		}

		return 'sb'
	},
	imageURL: '/blocks/spacing.jpg',
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'height',
					type: 'text',
					admin: {
						description: 'Fill the units with px, %, or em',
					},
				},
				{
					name: 'heightTablet',
					type: 'text',
					admin: {
						description: 'Fill the units with px, %, or em',
					},
				},
				{
					name: 'heightMobile',
					type: 'text',
					admin: {
						description: 'Fill the units with px, %, or em',
					},
				},
			],
		},
	],
}
