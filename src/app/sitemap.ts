import type { MetadataRoute } from 'next'

import {
	clientSitemap,
	pageSitemap,
	postCategorySitemap,
	postSitemap,
	serviceSitemap,
	teamPositionSitemap,
	teamSitemap,
	templateSitemap,
} from '$payload-libs/server/repos'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [pages, posts, postCategories, teams, teamPositions, clients, templates, services] =
		await Promise.all([
			pageSitemap(),
			postSitemap(),
			postCategorySitemap(),
			teamSitemap(),
			teamPositionSitemap(),
			clientSitemap(),
			templateSitemap(),
			serviceSitemap(),
		])

	return [
		...pages,
		...posts,
		...postCategories,
		...teams,
		...teamPositions,
		...clients,
		...templates,
		...services,
	]
		.filter((post) => !!post.link)
		.map((post) => ({
			url: process.env.NEXT_PUBLIC_SITE_URL + post.link!,
			lastModified: post.updatedAt,
			priority: 1,
		}))
}
