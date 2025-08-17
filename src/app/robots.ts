import type { MetadataRoute } from 'next'

import { slugReusable } from '$modules/vars'
import { getSiteGlobal } from '$root/lib/payload/server/repos'

export default async function robots(): Promise<MetadataRoute.Robots> {
	const site = await getSiteGlobal()

	return {
		rules: {
			userAgent: '*',
			disallow: site?.sitePublicly ? ['/admin/', `/${slugReusable}/`] : '/',
		},
		sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
	}
}
