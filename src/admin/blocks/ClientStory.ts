import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ClientStoryBlock: Block = {
	slug: 'clientStory',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cstb'
		}

		return 'cstb'
	},
	imageURL: '/blocks/client-story.jpg',
	fields: [
		{
			name: 'client',
			type: 'relationship',
			relationTo: 'clients',
		},
		styleField({
			textColor: true,
			padding: true,
			rounded: true,
			backgroundColor: true,
			backgroundImage: true,
		}),
	],
}
