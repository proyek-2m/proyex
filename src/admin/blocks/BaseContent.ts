import type { Block, Field } from 'payload'

import { styleField, textColorField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const BaseContentFields: Field[] = [
	{
		name: 'featuredText',
		type: 'richText',
		editor: richTextBasic(),
	},
	{
		name: 'content',
		type: 'richText',
	},
]

export const BaseContentBlock: Block = {
	slug: 'baseContent',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_bcb'
		}

		return 'bcb'
	},
	imageURL: '/blocks/base-content.jpg',
	fields: [
		...BaseContentFields,
		styleField({
			textColor: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'bcbaln',
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
