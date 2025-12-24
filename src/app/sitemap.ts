import type { MetadataRoute } from 'next'

import {
	clientSitemap,
	pageSitemap,
	postCategorySitemap,
	postSitemap,
	productSitemap,
} from '$payload-libs/server/repos'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [pages, posts, postCategories, clients, products] = await Promise.all([
		pageSitemap(),
		postSitemap(),
		postCategorySitemap(),
		clientSitemap(),
		productSitemap(),
	])

	return [...pages, ...posts, ...postCategories, ...clients, ...products]
		.filter((post) => !!post.link)
		.map((post) => ({
			url: process.env.NEXT_PUBLIC_SITE_URL + post.link!,
			lastModified: post.updatedAt,
			priority: 1,
		}))
}
