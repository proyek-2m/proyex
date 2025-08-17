import type { Block } from 'payload'

import { BaseContentFields } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { MediaFields } from '$payload-blocks/Media'
import { styleField, textColorField } from '$payload-fields/style'

export const SolutionsBlock: Block = {
	slug: 'solutions',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_ssb'
		}

		return 'ssb'
	},
	imageURL: '/blocks/solutions.jpg',
	fields: [
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_ssbi'
				}

				return 'ssbi'
			},
			name: 'items',
			label: 'Solution',
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
									return args.tableName + '_ssbia'
								}

								return 'ssbia'
							},
							name: 'actions',
							minRows: 1,
							fields: ButtonBlock.fields,
						},
					],
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
			],
		},
		{
			type: 'collapsible',
			label: 'Position',
			fields: [
				{
					type: 'row',
					fields: [
						{
							type: 'select',
							name: 'desktopPosition',
							enumName: 'ssbdpos',
							admin: {
								width: '50%',
							},
							options: [
								{
									label: 'Content Media',
									value: 'content-media',
								},
								{
									label: 'Media Content',
									value: 'media-content',
								},
							],
						},
						{
							type: 'select',
							name: 'mobilePosition',
							enumName: 'ssbmpos',
							admin: {
								width: '50%',
							},
							options: [
								{
									label: 'Content Media',
									value: 'content-media',
								},
								{
									label: 'Media Content',
									value: 'media-content',
								},
							],
						},
					],
				},
			],
		},
		styleField({
			textColor: true,
			gap: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'ssbaln',
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
			suffixFields: [
				textColorField({
					name: 'featuredTextColor',
				}),
			],
		}),
	],
}
