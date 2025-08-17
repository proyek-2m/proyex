import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingTemplateBlock: Block = {
	slug: 'listingTemplate',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_ltpb'
		}

		return 'ltpb'
	},
	imageURL: '/blocks/listing-template.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'ltpbtyp',
			options: [
				{
					label: 'Templates',
					value: 'templates',
				},
				{
					label: 'Selected Templates',
					value: 'selectedTemplates',
				},
				{
					label: 'Selected Services',
					value: 'selectedServices',
				},
				{
					label: 'Selected Teams',
					value: 'selectedTeams',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedTemplates',
			type: 'relationship',
			relationTo: 'templates',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedTemplates',
			},
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
			name: 'selectedTeams',
			type: 'relationship',
			relationTo: 'teams',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedTeams',
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
					enumName: 'ltpbor',
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
					enumName: 'ltpborby',
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
					enumName: 'ltpbpgn',
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
