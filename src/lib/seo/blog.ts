import type { Blog } from 'schema-dts'

import type { Page, Post } from '$payload-types'
import { assetUrl } from '$utils/common'
import { blogPostingSchema } from './blog-post'

export const blogSchema = (page: Page, blogPost?: Post[]): Blog => {
	return {
		'@type': 'Blog',
		name: page.meta?.title || page.title || 'Untitled',
		headline: page.meta?.title || page.title || 'Untitled',
		description: page.meta?.description || page.excerpt || undefined,
		url: page.link || undefined,
		image: assetUrl(page.meta?.image || page.featuredImage),
		dateCreated: page.createdAt || undefined,
		dateModified: page.updatedAt || undefined,
		datePublished: page.publishedAt || undefined,
		blogPost: blogPost?.map((post) => blogPostingSchema(post)),
	}
}
