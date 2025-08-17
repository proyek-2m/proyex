import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingPostCategoryBlock: Block = {
	slug: 'listingPostCategory',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lpcb'
		}

		return 'lpcb'
	},
	imageURL: '/blocks/listing-post-category.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lpcbtyp',
			options: [
				{
					label: 'Categories',
					value: 'categories',
				},
				{
					label: 'Selected Categories',
					value: 'selectedCategories',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedCategories',
			type: 'relationship',
			relationTo: 'postCategories',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedCategories',
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
					enumName: 'lpcbor',
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
					enumName: 'lpcborby',
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
					enumName: 'lpcbpgn',
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
