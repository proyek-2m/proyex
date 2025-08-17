import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingPostBlock: Block = {
	slug: 'listingPost',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lpb'
		}

		return 'lpb'
	},
	imageURL: '/blocks/listing-post.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lpbtyp',
			options: [
				{
					label: 'Posts',
					value: 'posts',
				},
				{
					label: 'Selected Posts',
					value: 'selectedPosts',
				},
				{
					label: 'Selected Categories',
					value: 'selectedCategories',
				},
				{
					label: 'CreatedBy',
					value: 'createdBy',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedPosts',
			type: 'relationship',
			relationTo: 'posts',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedPosts',
			},
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
			name: 'createdBy',
			type: 'relationship',
			relationTo: 'teams',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'createdBy',
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
					enumName: 'lpbor',
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
					enumName: 'lpborby',
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
					enumName: 'lpbpgn',
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
