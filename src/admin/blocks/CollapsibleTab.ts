import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const CollapsibleTabBlock: Block = {
	slug: 'collapsibleTab',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cltb'
		}

		return 'cltb'
	},
	imageURL: '/blocks/collapsible-tab.jpg',
	fields: [
		{
			type: 'select',
			name: 'variant',
			enumName: 'cltbvar',
			options: [
				{
					label: 'Default',
					value: 'default',
				},
				{
					label: 'Contained',
					value: 'contained',
				},
				{
					label: 'Filled',
					value: 'filled',
				},
				{
					label: 'Separated',
					value: 'separated',
				},
			],
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_cltbi'
				}

				return 'cltbi'
			},
			name: 'items',
			minRows: 2,
			fields: [
				{
					type: 'text',
					name: 'icon',
					admin: {
						width: '50%',
						description: 'Fill with name of icon from https://lucide.dev/icons',
					},
				},
				{
					name: 'heading',
					type: 'richText',
					editor: richTextBasic(),
				},
				{
					name: 'content',
					type: 'richText',
				},
			],
		},
		styleField({
			textColor: true,
			textColorOptions: {
				name: 'iconColor',
			},
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
