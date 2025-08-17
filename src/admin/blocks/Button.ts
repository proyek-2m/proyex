import type { Block } from 'payload'

import { styleField, textColorField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const ButtonBlock: Block = {
	slug: 'button',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_btn'
		}

		return 'btn'
	},
	imageURL: '/blocks/button.jpg',
	fields: [
		{
			name: 'label',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			type: 'collapsible',
			label: 'Link',
			fields: [
				{
					type: 'group',
					name: 'link',
					label: false,
					fields: [
						{
							type: 'row',
							fields: [
								{
									name: 'href',
									type: 'text',
									admin: {
										width: '50%',
									},
								},
								{
									name: 'target',
									type: 'select',
									enumName: 'btntrgt',
									admin: {
										width: '50%',
									},
									options: [
										{
											label: '_self',
											value: '_self',
										},
										{
											label: '_blank',
											value: '_blank',
										},
										{
											label: '_parent',
											value: '_parent',
										},
										{
											label: '_top',
											value: '_top',
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'collapsible',
			label: 'Icon',
			fields: [
				{
					type: 'group',
					name: 'icon',
					label: false,
					fields: [
						{
							type: 'row',
							fields: [
								{
									type: 'text',
									name: 'name',
									admin: {
										description:
											'Fill with name of icon from https://lucide.dev/icons',
										width: '33.333%',
									},
								},
								{
									type: 'number',
									name: 'size',
									admin: {
										description: 'Number of rem.',
										width: '33.333%',
									},
								},
								{
									name: 'position',
									type: 'select',
									enumName: 'btnipos',
									admin: {
										width: '33.333%',
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
									],
								},
							],
						},
						textColorField({
							name: 'color',
						}),
					],
				},
			],
		},
		styleField({
			rounded: true,
			backgroundColor: true,
			backgroundColorOptions: {
				name: 'color',
			},
			prefixFields: [
				{
					type: 'row',
					fields: [
						{
							name: 'variant',
							type: 'select',
							enumName: 'btnvar',
							admin: {
								width: '33.333%',
							},
							options: [
								{
									label: 'Filled',
									value: 'filled',
								},
								{
									label: 'Outline',
									value: 'outline',
								},
								{
									label: 'Light',
									value: 'light',
								},
								{
									label: 'Subtle',
									value: 'subtle',
								},
								{
									label: 'Transparent',
									value: 'transparent',
								},
							],
						},
						{
							name: 'size',
							type: 'select',
							enumName: 'btnsz',
							admin: {
								width: '33.333%',
							},
							options: [
								{
									label: 'Extra Small',
									value: 'xs',
								},
								{
									label: 'Small',
									value: 'sm',
								},
								{
									label: 'Medium',
									value: 'md',
								},
								{
									label: 'Large',
									value: 'lg',
								},
								{
									label: 'Extra Large',
									value: 'xl',
								},
							],
						},
						{
							name: 'align',
							type: 'select',
							enumName: 'btnaln',
							admin: {
								width: '33.333%',
							},
							options: [
								{
									label: 'Inline',
									value: 'inline',
								},
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
								{
									label: 'Full Width',
									value: 'full',
								},
							],
						},
					],
				},
			],
		}),
	],
}
