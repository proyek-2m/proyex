import type { Block } from 'payload'

import { BaseContentFields } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { styleField, textColorField } from '$payload-fields/style'

export const HeadingListingBlock: Block = {
	slug: 'headingListing',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_hlb'
		}

		return 'hlb'
	},
	imageURL: '/blocks/heading-listing.jpg',
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
			],
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_hlba'
				}

				return 'hlba'
			},
			name: 'actions',
			minRows: 1,
			fields: ButtonBlock.fields,
		},
		styleField({
			textColor: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'hlbaln',
					options: [
						{
							label: 'Between',
							value: 'between',
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
