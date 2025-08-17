import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		useAsTitle: 'email',
		hidden: ({ user }) => user?.role !== 'admin',
	},
	auth: true,
	fields: [
		{
			name: 'name',
			type: 'text',
		},
		{
			name: 'role',
			type: 'select',
			defaultValue: 'admin',
			options: [
				{
					label: 'Admin',
					value: 'admin',
				},
				{
					label: 'Editor',
					value: 'editor',
				},
				{
					label: 'Author',
					value: 'author',
				},
			],
			admin: {
				condition: (data, _, { user }) => {
					return !data?.createdAt || data.role === 'admin' || user?.role === 'admin'
				},
			},
		},
	],
}
