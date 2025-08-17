import type { BlogPosting } from 'schema-dts'

import type { Post } from '$payload-types'
import { personSchema } from '$seo/person'
import { assetUrl } from '$utils/common'

export const blogPostingSchema = (post: Post): BlogPosting => {
	return {
		'@type': 'BlogPosting',
		name: post.meta?.title || post.title || 'Untitled',
		headline: post.meta?.title || post.title || 'Untitled',
		description: post.meta?.description || post.excerpt || undefined,
		url: post.link || undefined,
		image: assetUrl(post.meta?.image || post.featuredImage),
		dateCreated: post.createdAt || undefined,
		dateModified: post.updatedAt || undefined,
		datePublished: post.publishedAt || undefined,
		author:
			post.createdBy && typeof post.createdBy === 'object'
				? personSchema(post.createdBy)
				: undefined,
		creator:
			post.createdBy && typeof post.createdBy === 'object'
				? personSchema(post.createdBy)
				: undefined,
	}
}
