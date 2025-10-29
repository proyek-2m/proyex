import type { CollectionConfig } from 'payload'

import { afterReadHookLink } from '$payload-fields/link'
import { metafield } from '$payload-fields/metadata'
import {
	authenticated,
	authenticatedActionRole,
	authenticatedOrPublished,
} from '$payload-libs/access-rules'
import { teamGender, teamLevel } from '$payload-libs/enum'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'

export const Teams: CollectionConfig = {
	slug: 'teams',
	dbName: 'tmc',
	defaultPopulate: {
		id: true,
		title: true,
		name: true,
		slug: true,
		excerpt: true,
		featuredImage: true,
		level: true,
		gender: true,
		city: true,
		motivation: true,
		socials: true,
		avatar: true,
		positions: true,
		publishedAt: true,
		createdAt: true,
		updatedAt: true,
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'positions', '_status', 'updatedAt', 'user'],
		group: 'Team',
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
									type: 'select',
									name: 'level',
									enumName: 'tmclvl',
									options: teamLevel,
									admin: {
										width: '50%',
										condition: (_, __, { user }) => {
											return !!user && user.role === 'admin'
										},
									},
								},
								{
									type: 'select',
									name: 'gender',
									enumName: 'tmcgndr',
									options: teamGender,
									admin: {
										width: '50%',
									},
								},
							],
						},
						{
							type: 'text',
							name: 'city',
						},
						{
							type: 'textarea',
							name: 'motivation',
						},
						{
							type: 'group',
							name: 'socials',
							fields: [
								{
									type: 'row',
									fields: [
										{
											type: 'text',
											name: 'email',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'website',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'github',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'linkedin',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'instagram',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'tiktok',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'youtube',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'facebook',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'twitter',
											admin: {
												width: '33.333%',
											},
										},
									],
								},
							],
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
								'actions',
								'baseContent',
								'cardForm',
								'clientStory',
								'collapsibleTab',
								'clientStorySlider',
								'clientStoryTeams',
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
					name: 'avatar',
					type: 'upload',
					relationTo: 'asset',
				},
				{
					name: 'positions',
					type: 'relationship',
					relationTo: 'teamPositions',
					hasMany: true,
				},
				{
					name: 'user',
					type: 'relationship',
					relationTo: 'users',
					unique: true,
				},
			],
		}),
	],
}
