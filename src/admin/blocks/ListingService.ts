import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingServiceBlock: Block = {
	slug: 'listingService',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lscb'
		}

		return 'lscb'
	},
	imageURL: '/blocks/listing-service.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lscbtyp',
			options: [
				{
					label: 'Services',
					value: 'services',
				},
				{
					label: 'Selected Services',
					value: 'selectedServices',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedServices',
			type: 'relationship',
			relationTo: 'services',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedServices',
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
					enumName: 'lscbor',
					admin: {
						width: '25%',
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
					enumName: 'lscborby',
					admin: {
						width: '25%',
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
						width: '25%',
					},
				},
				{
					type: 'select',
					name: 'pagination',
					enumName: 'lscbpgn',
					admin: {
						width: '25%',
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
