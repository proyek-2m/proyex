import path from 'path'
import { buildConfig, type Field, type PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'

import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'
import { richTextEditor } from '$payload-libs/richtext'
import { getSiteGlobal } from '$payload-libs/server/repos'

import { SiteConfig } from '$payload-global/Site'

import { formFields } from '$payload-fields/forms'
import { seoField } from '$payload-fields/seo'

import { Clients } from '$payload-collections/Clients'
import { Pages } from '$payload-collections/Pages'
import { PostCategories } from '$payload-collections/PostCategories'
import { Posts } from '$payload-collections/Posts'
import { Products } from '$payload-collections/Products'
import { Asset } from '$payload-collections/statics/Asset'
import { Faqs } from '$payload-collections/statics/Faqs'
import { Reusables } from '$payload-collections/statics/Reusables'
import { Users } from '$payload-collections/statics/Users'

import { ActionsBlock } from '$payload-blocks/Actions'
import { BannerBlock } from '$payload-blocks/Banner'
import { BaseContentBlock } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { CardFormBlock } from '$payload-blocks/CardForm'
import { ClientStoryBlock } from '$payload-blocks/ClientStory'
import { ClientStorySliderBlock } from '$payload-blocks/ClientStorySlider'
import { CollapsibleTabBlock } from '$payload-blocks/CollapsibleTab'
import { ContentCardsBlock } from '$payload-blocks/ContentCards'
import { ContentCTACardBlock } from '$payload-blocks/ContentCTACard'
import { ContentIconGridBlock } from '$payload-blocks/ContentIconGrid'
import { ContentMediaBlock } from '$payload-blocks/ContentMedia'
import { ContentMediaCardBlock } from '$payload-blocks/ContentMediaCard'
import { DividerBlock } from '$payload-blocks/Divider'
import { FeaturedListingClientBlock } from '$payload-blocks/FeaturedListingClient'
import { GalleryBlock } from '$payload-blocks/Gallery'
import { HeadingListingBlock } from '$payload-blocks/HeadingListing'
import { InsightDisplayBlock } from '$payload-blocks/InsightDisplay'
import { ListingClientBlock } from '$payload-blocks/ListingClient'
import { ListingFaqBlock } from '$payload-blocks/ListingFaq'
import { ListingPostBlock } from '$payload-blocks/ListingPost'
import { ListingPostCategoryBlock } from '$payload-blocks/ListingPostCategories'
import { ListingProductBlock } from '$payload-blocks/ListingProduct'
import { MediaBlock } from '$payload-blocks/Media'
import { ShowReusableBlock } from '$payload-blocks/Reusable'
import { SocialMapBlock } from '$payload-blocks/SocialMap'
import { SolutionsBlock } from '$payload-blocks/Solutions'
import { SpacingBlock } from '$payload-blocks/Spacing'
import { USPBlock } from '$payload-blocks/USP'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	indexSortableFields: false,
	telemetry: false,
	admin: {
		theme: 'light',
		user: Users.slug,
		importMap: {
			baseDir: '@',
		},
		meta: {
			titleSuffix: ' | SMFOODSMart Dashboard',
			icons: '/favicon.jpg',
		},
		components: {
			graphics: {
				Icon: '$payload-fields/components/branding#Icon',
				Logo: '$payload-fields/components/branding#Logo',
			},
		},
		livePreview: {
			breakpoints: [
				{
					label: 'Mobile',
					name: 'mobile',
					width: 375,
					height: 667,
				},
				{
					label: 'Tablet',
					name: 'tablet',
					width: 768,
					height: 1024,
				},
				{
					label: 'Desktop',
					name: 'desktop',
					width: 1440,
					height: 768,
				},
			],
		},
	},
	debug: process.env.NODE_ENV === 'development',
	defaultDepth: 5,
	collections: [Asset, Pages, Posts, PostCategories, Products, Clients, Faqs, Reusables, Users],
	cors: [process.env.NEXT_PUBLIC_SITE_URL],
	globals: [SiteConfig],
	editor: richTextEditor(),
	blocks: [
		ButtonBlock,
		MediaBlock,
		GalleryBlock,
		SpacingBlock,
		DividerBlock,
		CardFormBlock,
		ActionsBlock,
		BannerBlock,
		BaseContentBlock,
		ContentCardsBlock,
		ContentIconGridBlock,
		ContentMediaBlock,
		ContentMediaCardBlock,
		ContentCTACardBlock,
		InsightDisplayBlock,
		SolutionsBlock,
		USPBlock,
		SocialMapBlock,
		CardFormBlock,
		ClientStoryBlock,
		ClientStorySliderBlock,
		CollapsibleTabBlock,
		ShowReusableBlock,
		FeaturedListingClientBlock,
		HeadingListingBlock,
		ListingClientBlock,
		ListingFaqBlock,
		ListingPostBlock,
		ListingPostCategoryBlock,
		ListingProductBlock,
	],
	secret: process.env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	graphQL: {
		disable: true,
	},
	db: postgresAdapter({
		blocksAsJSON: true,
		pool: {
			connectionString: process.env.DATABASE_URI,
			ssl: {
				rejectUnauthorized: false,
			},
		},
	}),
	sharp,
	email: nodemailerAdapter({
		defaultFromAddress: 'smfoods1266@gmail.com',
		defaultFromName: 'SMFOODSMart',
		transportOptions: {
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		},
	}),
	plugins: [
		seoPlugin({
			collections: ['clients', 'pages', 'posts', 'postCategories', 'products'],
			uploadsCollection: 'asset',
			tabbedUI: true,
			fields: (args) => {
				const seoFields: Field[] = []

				args.defaultFields.forEach((field) => {
					if ('name' in field && field.name === 'preview') {
						seoField.forEach((seoField) => {
							seoFields.push(seoField)
						})
					} else {
						seoFields.push(field)
					}
				})

				return seoFields
			},
			generateTitle: async ({ doc }) => {
				const siteConfig = await getSiteGlobal()
				return doc?.title + (siteConfig?.title ? ` – ${siteConfig.title}` : '')
			},
			generateDescription: ({ doc }) => doc?.excerpt || '',
		}),
		formBuilderPlugin({
			redirectRelationships: ['pages'],
			formOverrides: {
				fields: ({ defaultFields }) => formFields({ defaultFields }),
				hooks: {
					afterChange: [revalidateChangeStatic],
					afterDelete: [revalidateDeleteStatic],
				},
			},
		}),
		s3Storage({
			collections: {
				asset: {
					prefix: 'asset',
				},
			},
			bucket: process.env.SUPABASE_S3_BUCKET,
			config: {
				forcePathStyle: true,
				credentials: {
					accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
					secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
				},
				region: process.env.SUPABASE_S3_REGION,
				endpoint: process.env.SUPABASE_S3_ENDPOINT,
			},
		}),
	],
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				if (req.user) return true

				const authHeader = req.headers.get('authorization')
				return authHeader === `Bearer ${process.env.CRON_SECRET}`
			},
		},
		tasks: [],
	},
})
