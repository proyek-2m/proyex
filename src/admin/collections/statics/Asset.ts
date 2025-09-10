import type { CollectionConfig } from 'payload'

export const Asset: CollectionConfig = {
	slug: 'asset',
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
		},
	],
	upload: {
		mimeTypes: ['image/*', 'video/*', 'application/pdf'],
	},
}
