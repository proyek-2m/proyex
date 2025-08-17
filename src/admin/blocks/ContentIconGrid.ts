import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'
import { BaseContentFields } from './BaseContent'
import { ButtonBlock } from './Button'

export const ContentIconGridBlock: Block = {
	slug: 'contentIconGrid',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cigb'
		}

		return 'cigb'
	},
	imageURL: '/blocks/content-icon-grid.jpg',
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
							return args.tableName + '_cigba'
						}

						return 'cigba'
					},
					name: 'actions',
					minRows: 1,
					fields: ButtonBlock.fields,
				},
			],
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_cigbi'
				}

				return 'cigbi'
			},
			name: 'items',
			label: 'USP',
			minRows: 2,
			fields: [
				{
					type: 'row',
					fields: [
						{
							type: 'text',
							name: 'icon',
							admin: {
								width: '30%',
								description: 'Fill with name of icon from https://lucide.dev/icons',
							},
						},
						{
							type: 'richText',
							name: 'title',
							editor: richTextBasic(),
							admin: {
								width: '70%',
							},
						},
					],
				},
				{
					type: 'richText',
					name: 'content',
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
				{
					name: 'position',
					type: 'select',
					enumName: 'cigbpos',
					options: [
						{
							label: 'Content USPs',
							value: 'content-usps',
						},
						{
							label: 'USPs Content',
							value: 'usps-content',
						},
					],
				},
			],
		}),
	],
}
