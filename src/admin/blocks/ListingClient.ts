import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingClientBlock: Block = {
	slug: 'listingClient',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lcb'
		}

		return 'lcb'
	},
	imageURL: '/blocks/listing-client.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lcbtyp',
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
					enumName: 'lcbor',
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
					enumName: 'lcborby',
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
		{
			type: 'row',
			fields: [
				{
					type: 'checkbox',
					name: 'showFilter',
					admin: {
						width: '50%',
					},
				},
				{
					type: 'select',
					name: 'pagination',
					enumName: 'lcbpgn',
					admin: {
						width: '50%',
					},
					options: [
						{
							label: 'None',
							value: 'none',
						},
						{
							label: 'Paged',
							value: 'paged',
						},
						{
							label: 'Load More',
							value: 'load-more',
						},
						{
							label: 'Infinite Scroll',
							value: 'infinite-scroll',
						},
					],
				},
			],
		},
		styleField({
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
