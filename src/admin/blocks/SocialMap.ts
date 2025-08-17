import type { Block } from 'payload'

import { roundedField, styleField } from '$payload-fields/style'

export const SocialMapBlock: Block = {
	slug: 'socialMap',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_smb'
		}

		return 'smb'
	},
	imageURL: '/blocks/social-map.jpg',
	fields: [
		{
			type: 'text',
			name: 'gmapSource',
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_smbi'
				}

				return 'smbi'
			},
			name: 'items',
			label: 'Social',
			fields: [
				{
					type: 'row',
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
							type: 'text',
							name: 'title',
							admin: {
								width: '50%',
							},
						},
						{
							type: 'text',
							name: 'label',
							admin: {
								width: '50%',
							},
						},
						{
							type: 'text',
							name: 'link',
							admin: {
								width: '50%',
							},
						},
					],
				},
			],
		},
		styleField({
			textColor: true,
			textColorOptions: {
				name: 'iconColor',
			},
			gap: true,
			rounded: true,
			prefixFields: [
				{
					name: 'position',
					type: 'select',
					enumName: 'smbpos',
					options: [
						{
							label: 'Top',
							value: 'top',
						},
						{
							label: 'Center',
							value: 'center',
						},
						{
							label: 'Bottom',
							value: 'bottom',
						},
					],
				},
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
			],
			suffixFields: [
				roundedField({
					name: 'socialRounded',
				}),
			],
		}),
	],
}
