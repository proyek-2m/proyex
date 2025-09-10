import type { CollectionConfig } from 'payload'

import { afterReadHookLink } from '$payload-fields/link'
import { metafield } from '$payload-fields/metadata'
import {
	authenticated,
	authenticatedActionRole,
	authenticatedOrPublished,
} from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Posts: CollectionConfig = {
	slug: 'posts',
	dbName: 'poc',
	defaultPopulate: {
		id: true,
		title: true,
		slug: true,
		link: true,
		excerpt: true,
		featuredImage: true,
		category: true,
		createdBy: true,
		publishedAt: true,
		createdAt: true,
		updatedAt: true,
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'category', '_status', 'updatedAt', 'createdBy'],
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
					label: 'Editor',
					fields: [
						{
							name: 'content',
							type: 'blocks',
							label: false,
							blocks: [],
							blockReferences: [
								'actions',
								'baseContent',
								'cardForm',
								'clientStory',
								'clientStorySlider',
								'clientStoryTeams',
								'collapsibleTab',
								'contentCards',
								'contentIconGrid',
								'contentMedia',
								'contentMediaCard',
								'contentCtaCard',
								'divider',
								'featuredListingClient',
								'gallery',
								'headingListing',
								'insightDisplay',
								'listingClient',
								'listingFaq',
								'listingPost',
								'listingPostCategory',
								'listingService',
								'listingTeam',
								'listingTemplate',
								'media',
								'showReusable',
								'solutions',
								'socialMap',
								'spacing',
								'usp',
							],
						},
					],
				},
			],
		},
		...metafield({
			general: [
				{
					name: 'category',
					type: 'relationship',
					relationTo: 'postCategories',
				},
				{
					name: 'createdBy',
					type: 'relationship',
					relationTo: 'teams',
				},
			],
		}),
	],
}
