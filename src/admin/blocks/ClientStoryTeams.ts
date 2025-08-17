import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ClientStoryTeamsBlock: Block = {
	slug: 'clientStoryTeams',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_csttb'
		}

		return 'csttb'
	},
	imageURL: '/blocks/client-story-teams.jpg',
	fields: [
		{
			name: 'client',
			type: 'relationship',
			relationTo: 'clients',
		},
		styleField({
			textColor: true,
		}),
	],
}
