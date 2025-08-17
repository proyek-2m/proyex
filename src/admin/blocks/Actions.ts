import type { Block } from 'payload'

import { ButtonBlock } from '$payload-blocks/Button'
import { styleField } from '$payload-fields/style'

export const ActionsBlock: Block = {
	slug: 'actions',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_acb'
		}

		return 'acb'
	},
	imageURL: '/blocks/button.jpg',
	fields: [
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_acbi'
				}

				return 'acbi'
			},
			name: 'items',
			minRows: 1,
			fields: ButtonBlock.fields,
		},
		styleField({
			gap: true,
			prefixFields: [
				{
					type: 'row',
					fields: [
						{
							name: 'align',
							type: 'select',
							enumName: 'acaln',
							admin: {
								width: '50%',
							},
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
							name: 'direction',
							type: 'select',
							enumName: 'acdir',
							admin: {
								width: '50%',
							},
							options: [
								{
									label: 'Row',
									value: 'row',
								},
								{
									label: 'Column',
									value: 'column',
								},
							],
						},
					],
				},
			],
		}),
	],
}
