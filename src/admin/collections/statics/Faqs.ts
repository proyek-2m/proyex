import type { CollectionConfig } from 'payload'

import { authenticated } from '$payload-libs/access-rules'
import { faqTypes } from '$payload-libs/enum'
import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'

export const Faqs: CollectionConfig = {
	slug: 'faqs',
	dbName: 'fqc',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'type', 'updatedAt', 'author'],
	},
	access: {
		create: authenticated,
		read: () => true,
		update: authenticated,
		delete: authenticated,
	},
	hooks: {
		afterChange: [revalidateChangeStatic],
		afterDelete: [revalidateDeleteStatic],
	},
	fields: [
		{
			type: 'text',
			name: 'title',
		},
		{
			type: 'select',
			name: 'type',
			hasMany: true,
			options: faqTypes,
		},
		{
			type: 'richText',
			name: 'message',
		},
	],
}
