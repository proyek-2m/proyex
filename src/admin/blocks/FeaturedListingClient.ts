import type { Block } from 'payload'

import { BaseContentFields } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { styleField, textColorField } from '$payload-fields/style'

export const FeaturedListingClientBlock: Block = {
	slug: 'featuredListingClient',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_flc'
		}

		return 'flc'
	},
	imageURL: '/blocks/featured-listing-client.jpg',
	fields: [
		{
			type: 'collapsible',
			label: 'Content',
			fields: [
				{
					type: 'group',
					name: 'content',
					label: false,
					fields: BaseContentFields,
				},
				{
					type: 'array',
					dbName: (args) => {
						if (args.tableName) {
							return args.tableName + '_flca'
						}

						return 'flca'
					},
					name: 'actions',
					minRows: 1,
					fields: ButtonBlock.fields,
				},
			],
		},
		{
			name: 'type',
			type: 'select',
			enumName: 'flctyp',
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
					label: 'Selected Templates',
					value: 'selectedTemplates',
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
			name: 'selectedClients',
			type: 'relationship',
			relationTo: 'clients',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedClients',
			},
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
					enumName: 'flcor',
					admin: {
						width: '50%',
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
					enumName: 'flcorby',
					admin: {
						width: '50%',
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
			],
		},
		{
			name: 'total',
			type: 'number',
			min: 1,
			admin: {
				condition: (_, siblingData) => siblingData.type !== 'selectedClients',
			},
		},
		styleField({
			textColor: true,
			gap: true,
			prefixFields: [
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
				textColorField({
					name: 'featuredTextColor',
				}),
			],
		}),
	],
}
