import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { faqTypes } from '$payload-libs/enum'

export const ListingFaqBlock: Block = {
	slug: 'listingFaq',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lfb'
		}

		return 'lfb'
	},
	imageURL: '/blocks/listing-faq.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lfbtyp',
			options: [
				{
					label: 'Faqs',
					value: 'faqs',
				},
				{
					label: 'Selected Faqs',
					value: 'selectedFaqs',
				},
				{
					label: 'Selected Types',
					value: 'selectedTypes',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedFaqs',
			type: 'relationship',
			relationTo: 'faqs',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedFaqs',
			},
		},
		{
			name: 'selectedTypes',
			type: 'select',
			enumName: 'lfbstyps',
			hasMany: true,
			options: faqTypes,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedTypes',
			},
		},
		{
			name: 'search',
			type: 'text',
			admin: {
				condition: (_, siblingData) => siblingData.type === 'search',
			},
		},
		{
			type: 'row',
			fields: [
				{
					name: 'order',
					type: 'select',
					enumName: 'lfbor',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'DESC',
							value: 'DESC',
						},
						{
							label: 'ASC',
							value: 'ASC',
						},
					],
				},
				{
					name: 'orderBy',
					type: 'select',
					enumName: 'lfborby',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'Date',
							value: 'date',
						},
						{
							label: 'Title',
							value: 'title',
						},
					],
				},
				{
					name: 'total',
					type: 'number',
					min: 1,
					admin: {
						width: '33.333%',
					},
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					type: 'checkbox',
					name: 'showFilter',
					admin: {
						width: '50%',
					},
				},
				{
					type: 'select',
					name: 'pagination',
					enumName: 'lfbpgn',
					admin: {
						width: '50%',
					},
					options: [
						{
							label: 'None',
							value: 'none',
						},
						{
							label: 'Paged',
							value: 'paged',
						},
						{
							label: 'Load More',
							value: 'load-more',
						},
						{
							label: 'Infinite Scroll',
							value: 'infinite-scroll',
						},
					],
				},
			],
		},
		styleField({
			gap: true,
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
