import type { Block } from 'payload'

import { BaseContentFields } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { MediaFields } from '$payload-blocks/Media'
import { styleField, textColorField } from '$payload-fields/style'

export const InsightDisplayBlock: Block = {
	slug: 'insightDisplay',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_idb'
		}

		return 'idb'
	},
	imageURL: '/blocks/insight-display.jpg',
	fields: [
		...BaseContentFields,
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_idba'
				}

				return 'idba'
			},
			name: 'actions',
			minRows: 1,
			fields: ButtonBlock.fields,
		},
		{
			type: 'collapsible',
			label: 'Media',
			fields: [
				{
					type: 'group',
					name: 'media',
					label: false,
					fields: MediaFields,
				},
			],
		},
		styleField({
			textColor: true,
			padding: true,
			rounded: true,
			backgroundColor: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'idbaln',
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
				textColorField({
					name: 'featuredTextColor',
				}),
			],
		}),
	],
}
