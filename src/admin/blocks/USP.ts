import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const USPBlock: Block = {
	slug: 'usp',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_uspb'
		}

		return 'uspb'
	},
	imageURL: '/blocks/usp.jpg',
	fields: [
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_uspbi'
				}

				return 'uspbi'
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
					editor: richTextBasic(),
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
					name: 'align',
					type: 'select',
					enumName: 'uspbaln',
					options: [
						{
							label: 'Left',
							value: 'left',
						},
						{
							label: 'Right',
							value: 'right',
						},
						{
							label: 'Center',
							value: 'center',
						},
					],
				},
			],
		}),
	],
}
