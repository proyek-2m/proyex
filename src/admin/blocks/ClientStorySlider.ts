import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ClientStorySliderBlock: Block = {
	slug: 'clientStorySlider',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cssb'
		}

		return 'cssb'
	},
	imageURL: '/blocks/client-story-card.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'cssbtyp',
			options: [
				{
					label: 'Clients',
					value: 'clients',
				},
				{
					label: 'Selected Clients',
					value: 'selectedClients',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedClients',
			type: 'relationship',
			relationTo: 'clients',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedClients',
			},
		},
		{
			name: 'search',
			type: 'text',
			admin: {
				condition: (_, siblingData) => siblingData.type === 'search',
			},
		},
		{
			type: 'row',
			fields: [
				{
					name: 'order',
					type: 'select',
					enumName: 'cssbor',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'DESC',
							value: 'DESC',
						},
						{
							label: 'ASC',
							value: 'ASC',
						},
					],
				},
				{
					name: 'orderBy',
					type: 'select',
					enumName: 'cssborby',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'Date',
							value: 'date',
						},
						{
							label: 'Title',
							value: 'title',
						},
					],
				},
				{
					name: 'total',
					type: 'number',
					min: 1,
					admin: {
						width: '33.333%',
					},
				},
			],
		},
		styleField({
			rounded: true,
			gap: true,
			prefixFields: [
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
			],
		}),
	],
}
