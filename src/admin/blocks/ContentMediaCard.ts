import type { Block } from 'payload'

import { BaseContentFields } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { MediaFields } from '$payload-blocks/Media'
import { styleField, textColorField } from '$payload-fields/style'

export const ContentMediaCardBlock: Block = {
	slug: 'contentMediaCard',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_cmcb'
		}

		return 'cmcb'
	},
	imageURL: '/blocks/content-media-card.jpg',
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
							return args.tableName + '_cmcba'
						}

						return 'cmcba'
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
		styleField({
			backgroundColor: true,
			textColor: true,
			gap: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'cmcbaln',
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
				{
					type: 'row',
					fields: [
						{
							type: 'select',
							name: 'desktopPosition',
							enumName: 'cmcbdpos',
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
							enumName: 'cmcbmpos',
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
				textColorField({
					name: 'featuredTextColor',
				}),
			],
		}),
	],
}
