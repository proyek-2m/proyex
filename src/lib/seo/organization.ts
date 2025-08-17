import type { Corporation } from 'schema-dts'

import type { Site } from '$payload-types'
import { assetUrl } from '$utils/common'

export const organizationSchema = (site: Site): Corporation => {
	const sameAs: string[] = []

	if (site.socials) {
		Object.values(site.socials).forEach((social) => {
			if (social) {
				sameAs.push(social)
			}
		})
	}

	return {
		'@type': 'Corporation',
		name: site.title || undefined,
		url: process.env.NEXT_PUBLIC_SITE_URL,
		address: site.socials?.address || undefined,
		email: site.socials?.email || undefined,
		telephone: site.socials?.telephone || undefined,
		logo: assetUrl(site.logo),
		image: assetUrl(site.logo),
		contactPoint: {
			'@type': 'ContactPoint',
			email: site.socials?.email || undefined,
			telephone: site.socials?.telephone || undefined,
		},
		sameAs: sameAs,
	}
}
