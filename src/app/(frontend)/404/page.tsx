import { slug404 } from '$modules/vars'
import { generateMeta } from '$payload-libs/meta-utils'
import { getSiteGlobal } from '$payload-libs/server/repos'
import { seoSchema } from '$seo/index'
import { pageLoader } from '$server-functions/loader'
import SiteTemplate from '$templates/site'

export const dynamic = 'force-static'
export const revalidate = 2592000

export default async function notFoundPage() {
	const page = await pageLoader([slug404])

	if (!page) {
		return null
	}

	const siteConfig = await getSiteGlobal()

	const metadata = await generateMeta(page, siteConfig)

	return (
		<>
			<title>
				{typeof metadata.title === 'string' ? metadata.title : `404 | ${siteConfig?.title}`}
			</title>
			<script
				id="organization-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						seoSchema({
							collection: 'pages',
							data: page,
							site: siteConfig,
						}),
					),
				}}
			/>
			<SiteTemplate
				data={page}
				site={siteConfig}
				collection="pages"
			/>
		</>
	)
}
