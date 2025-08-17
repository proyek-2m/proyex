import type { Block, Field } from 'payload'

import { styleField } from '$payload-fields/style'

export const MediaFields: Field[] = [
	{
		type: 'row',
		fields: [
			{
				name: 'type',
				type: 'select',
				enumName: 'mtyp',
				admin: {
					width: '50%',
				},
				options: [
					{
						label: 'Image',
						value: 'image',
					},
					{
						label: 'Video',
						value: 'video',
					},
				],
			},
			{
				name: 'source',
				type: 'select',
				enumName: 'msrc',
				admin: {
					width: '50%',
				},
				options: [
					{
						label: 'Internal',
						value: 'internal',
					},
					{
						label: 'External',
						value: 'external',
					},
				],
			},
		],
	},
	{
		name: 'imageInternal',
		type: 'upload',
		relationTo: 'asset',
		admin: {
			condition: (_, siblingData) =>
				siblingData.type === 'image' && siblingData.source === 'internal',
		},
	},
	{
		name: 'imageExternal',
		type: 'text',
		admin: {
			condition: (_, siblingData) =>
				siblingData.type === 'image' && siblingData.source === 'external',
		},
	},
	{
		name: 'videoInternal',
		type: 'upload',
		relationTo: 'asset',
		admin: {
			condition: (_, siblingData) =>
				siblingData.type === 'video' && siblingData.source === 'internal',
		},
	},
	{
		name: 'videoExternal',
		type: 'text',
		admin: {
			condition: (_, siblingData) =>
				siblingData.type === 'video' && siblingData.source === 'external',
		},
	},
	{
		type: 'row',
		admin: {
			condition: (_, siblingData) => siblingData.type === 'video',
		},
		fields: [
			{
				name: 'videoOptions',
				type: 'select',
				enumName: 'mvopt',
				hasMany: true,
				admin: {
					width: '50%',
				},
				options: [
					{
						label: 'Loop',
						value: 'loop',
					},
					{
						label: 'Autoplay',
						value: 'autoplay',
					},
				],
			},
			{
				name: 'videoPoster',
				type: 'upload',
				relationTo: 'asset',
				admin: {
					width: '50%',
				},
			},
		],
	},
	{
		type: 'row',
		fields: [
			{
				name: 'action',
				type: 'select',
				enumName: 'mac',
				options: [
					{
						label: 'None',
						value: 'none',
					},
					{
						label: 'Link',
						value: 'link',
					},
					{
						label: 'Lightbox',
						value: 'lightbox',
					},
				],
			},
			{
				name: 'actionLink',
				type: 'text',
				admin: {
					condition: (_, siblingData) => siblingData.action === 'link',
				},
			},
		],
	},
]

export const MediaBlock: Block = {
	slug: 'media',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_mb'
		}

		return 'mb'
	},
	imageURL: '/blocks/media.jpg',
	fields: [
		...MediaFields,
		styleField({
			rounded: true,
			objectFit: true,
			aspectRatio: true,
		}),
	],
}
