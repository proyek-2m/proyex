import type { CollectionConfig } from 'payload'

import { BannerBlock } from '$payload-blocks/Banner'
import { afterReadHookLink } from '$payload-fields/link'
import { metafield } from '$payload-fields/metadata'
import {
	authenticated,
	authenticatedActionRole,
	authenticatedOrPublished,
} from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Clients: CollectionConfig = {
	slug: 'clients',
	dbName: 'clc',
	defaultPopulate: {
		id: true,
		title: true,
		slug: true,
		link: true,
		excerpt: true,
		featuredImage: true,
		name: true,
		site: true,
		logo: true,
		landscapeImage: true,
		representationName: true,
		representationPosition: true,
		representationAvatar: true,
		story: true,
		publishedAt: true,
		createdAt: true,
		updatedAt: true,
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', '_status', 'updatedAt', 'author'],
		group: 'Content',
		livePreview: {
			url: ({ data, req }) =>
				generatePreviewPath({
					path: typeof data?.link === 'string' ? data.link : '/',
					req,
				}),
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				path: typeof data?.link === 'string' ? data.link : '',
				req,
			}),
	},
	versions: {
		drafts: {
			autosave: false,
		},
		maxPerDoc: 10,
	},
	access: {
		create: authenticated,
		read: authenticatedOrPublished,
		update: authenticatedActionRole,
		delete: authenticatedActionRole,
	},
	hooks: {
		afterRead: [afterReadHookLink],
		afterChange: [revalidateChange],
		afterDelete: [revalidateDelete],
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'General',
					fields: [
						{
							type: 'row',
							fields: [
								{
									type: 'text',
									name: 'name',
									admin: {
										width: '50%',
									},
								},
								{
									type: 'text',
									name: 'site',
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
									type: 'upload',
									name: 'logo',
									relationTo: 'asset',
									admin: {
										width: '50%',
									},
								},
								{
									type: 'upload',
									name: 'landscapeImage',
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
									type: 'text',
									name: 'representationName',
									admin: {
										width: '50%',
									},
								},
								{
									type: 'text',
									name: 'representationPosition',
									admin: {
										width: '50%',
									},
								},
							],
						},
						{
							type: 'upload',
							name: 'representationAvatar',
							relationTo: 'asset',
						},
						{
							type: 'textarea',
							name: 'story',
						},
					],
				},
				{
					label: 'Banner',
					fields: [
						{
							type: 'group',
							name: 'banner',
							label: false,
							fields: BannerBlock.fields,
						},
					],
				},
				{
					label: 'Editor',
					fields: [
						{
							name: 'content',
							type: 'blocks',
							label: false,
							blocks: [],
							blockReferences: [
								// 'actions',
								// 'baseContent',
								// 'cardForm',
								// 'clientStory',
								// 'clientStorySlider',
								// 'clientStoryTeams',
								// 'collapsibleTab',
								// 'contentMedia',
								// 'contentMediaCard',
								// 'contentCtaCard',
								// 'divider',
								// 'featuredListingClient',
								// 'gallery',
								// 'headingListing',
								// 'insightDisplay',
								// 'listingClient',
								// 'listingFaq',
								// 'listingPost',
								// 'listingPostCategory',
								// 'listingProduct',
								// 'media',
								// 'showReusable',
								// 'solutions',
								// 'socialMap',
								// 'spacing',
								// 'usp',
							],
						},
					],
				},
			],
		},
		...metafield(),
	],
}
