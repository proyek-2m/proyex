import type { Block } from 'payload'

export const ShowReusableBlock: Block = {
	slug: 'showReusable',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_srb'
		}

		return 'srb'
	},
	imageURL: '/blocks/spacing.jpg',
	fields: [
		{
			name: 'reusable',
			type: 'relationship',
			relationTo: 'reusables',
		},
	],
}
