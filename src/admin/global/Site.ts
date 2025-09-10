import type { GlobalConfig } from 'payload'

import { ButtonBlock } from '$payload-blocks/Button'
import { revalidateGlobal } from '$payload-libs/hooks/revalidate'

export const SiteConfig: GlobalConfig = {
	slug: 'site',
	access: {
		read: () => true,
	},
	admin: {
		hidden: ({ user }) => user?.role === 'author',
	},
	hooks: {
		afterChange: [revalidateGlobal],
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'General',
					fields: [
						{
							name: 'title',
							type: 'text',
						},
						{
							name: 'favicon',
							type: 'upload',
							relationTo: 'asset',
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
											name: 'telephone',
											admin: {
												width: '33.333%',
											},
										},
										{
											type: 'text',
											name: 'address',
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
										{
											type: 'text',
											name: 'github',
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
					label: 'Header',
					fields: [
						{
							name: 'logo',
							type: 'upload',
							relationTo: 'asset',
						},
						{
							name: 'navigation',
							type: 'array',
							dbName: 'navs',
							minRows: 1,
							fields: [
								{
									type: 'row',
									fields: [
										{
											name: 'label',
											type: 'text',
											admin: {
												width: '50%',
											},
										},
										{
											name: 'link',
											type: 'text',
											admin: {
												width: '50%',
											},
										},
									],
								},
								{
									name: 'submenu',
									type: 'array',
									dbName: 'smnu',
									minRows: 1,
									fields: [
										{
											type: 'row',
											fields: [
												{
													name: 'label',
													type: 'text',
													admin: {
														width: '50%',
													},
												},
												{
													name: 'link',
													type: 'text',
													admin: {
														width: '50%',
													},
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'array',
							dbName: 'fact',
							name: 'actions',
							fields: ButtonBlock.fields,
						},
					],
				},
				{
					label: 'Footer',
					fields: [
						{
							name: 'footerDescription',
							type: 'richText',
						},
						{
							name: 'footerNavigations',
							type: 'array',
							dbName: 'fnav',
							minRows: 1,
							fields: [
								{
									name: 'title',
									type: 'text',
								},
								{
									name: 'links',
									type: 'array',
									dbName: 'flnk',
									minRows: 1,
									fields: [
										{
											type: 'row',
											fields: [
												{
													name: 'label',
													type: 'text',
													admin: {
														width: '50%',
													},
												},
												{
													name: 'link',
													type: 'text',
													admin: {
														width: '50%',
													},
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
					label: 'Misc',
					fields: [
						{
							name: 'sitePublicly',
							type: 'checkbox',
							defaultValue: false,
							admin: {
								description: 'Encourage search engines from indexing this site',
							},
						},
						{
							name: 'googleAnalytics',
							type: 'text',
							admin: {
								description: 'Add your Google Analytics ID',
							},
						},
						{
							name: 'googleTagManager',
							type: 'text',
							admin: {
								description: 'Add your Google Tag Manager ID',
							},
						},
						{
							name: 'metaPixelID',
							type: 'text',
							admin: {
								description: 'Add your Meta Pixel ID',
							},
						},
						{
							name: 'tiktokPixelID',
							type: 'text',
							admin: {
								description: 'Add your TikTok Pixel ID',
							},
						},
					],
				},
			],
		},
	],
}
