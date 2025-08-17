import type { CollectionConfig } from 'payload'

import { metafield } from '$payload-fields/metadata'
import { authenticated, authenticatedActionRole } from '$payload-libs/access-rules'
import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Reusables: CollectionConfig = {
	slug: 'reusables',
	dbName: 'rc',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt', 'author'],
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
	access: {
		create: authenticated,
		read: () => true,
		update: authenticatedActionRole,
		delete: authenticatedActionRole,
	},
	hooks: {
		afterChange: [revalidateChangeStatic],
		afterDelete: [revalidateDeleteStatic],
	},
	fields: [
		{
			name: 'content',
			type: 'blocks',
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
				'solutions',
				'socialMap',
				'spacing',
				'usp',
			],
		},
		...metafield(),
	],
}
