import type { Block } from 'payload'

import { ButtonBlock } from '$payload-blocks/Button'
import { styleField } from '$payload-fields/style'

export const BannerBlock: Block = {
	slug: 'banner',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_bb'
		}

		return 'bb'
	},
	imageURL: '/blocks/banner.jpg',
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'type',
					type: 'select',
					enumName: 'bbtyp',
					options: [
						{
							label: 'Detail',
							value: 'detail',
						},
						{
							label: 'None',
							value: 'none',
						},
					],
				},
				{
					name: 'align',
					type: 'select',
					enumName: 'bbaln',
					admin: {
						condition: (_, siblingData) => siblingData.type !== 'none',
					},
					options: [
						{
							label: 'Center',
							value: 'center',
						},
						{
							label: 'Left',
							value: 'left',
						},
						{
							label: 'Right',
							value: 'right',
						},
					],
				},
			],
		},
		{
			name: 'featured',
			type: 'relationship',
			relationTo: ['clients', 'templates'],
			admin: {
				condition: (_, siblingData) => siblingData.type !== 'none',
			},
		},
		{
			name: 'content',
			type: 'richText',
			admin: {
				condition: (_, siblingData) => siblingData.type !== 'none',
			},
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_bbacs'
				}

				return 'bbacs'
			},
			name: 'actions',
			minRows: 1,
			fields: ButtonBlock.fields,
			admin: {
				condition: (_, siblingData) => siblingData.type !== 'none',
			},
		},
		styleField({
			textColor: true,
			backgroundColor: true,
			backgroundImage: true,
			field: {
				admin: {
					condition: (_, siblingData) => siblingData.type !== 'none',
				},
			},
		}),
	],
}
