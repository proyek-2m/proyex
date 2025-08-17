import type { Block } from 'payload'

import { MediaFields } from '$payload-blocks/Media'
import { styleField } from '$payload-fields/style'

export const GalleryBlock: Block = {
	slug: 'gallery',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_gb'
		}

		return 'gb'
	},
	imageURL: '/blocks/gallery.jpg',
	fields: [
		{
			type: 'select',
			name: 'display',
			enumName: 'gbdspl',
			options: [
				{
					label: 'Grid',
					value: 'grid',
				},
				{
					label: 'Grid Slider',
					value: 'grid-slider',
				},
			],
		},
		{
			type: 'array',
			dbName: (args) => {
				if (args.tableName) {
					return args.tableName + '_gbi'
				}

				return 'gbi'
			},
			name: 'items',
			label: 'Gallery Item',
			minRows: 2,
			fields: MediaFields,
		},
		styleField({
			gap: true,
			rounded: true,
			aspectRatio: true,
			objectFit: true,
			prefixFields: [
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
			],
		}),
	],
}
