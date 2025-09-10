import type { Metadata } from 'next'

import type { Client, Page, Post, PostCategory, Site, Team, Template } from '$payload-types'
import { assetUrl } from '$utils/common'

export async function generateMeta(
	doc: Pick<
		Post | PostCategory | Page | Team | Client | Template,
		'meta' | 'excerpt' | 'featuredImage' | 'title' | 'link' | '_status'
	>,
	site: Site | null,
): Promise<Metadata> {
	const siteTitle = site?.title || 'Proyex'

	let ogImage = undefined
	let title = siteTitle
	const description = doc?.meta?.description || doc?.excerpt || undefined
	const favicon = assetUrl(site?.favicon) || '/favicon.png'

	if (doc?.meta?.image) {
		ogImage = assetUrl(doc.meta.image)
	}

	if (doc?.featuredImage && !ogImage) {
		ogImage = assetUrl(doc.featuredImage)
	}

	if (favicon && !ogImage) {
		ogImage = favicon
	}

	if (doc?.meta?.title) {
		title = doc.meta.title
	} else if (doc?.title) {
		title = `${doc.title} | ${siteTitle}`
	}

	return {
		title,
		description,
		robots:
			!site?.sitePublicly || doc._status === 'draft'
				? 'noindex, nofollow'
				: doc.meta?.robots || 'index, follow',
		keywords: doc.meta?.keywords,
		icons: favicon,
		openGraph: {
			description,
			images: ogImage,
			title,
			type: 'website',
			url: doc?.link || '/',
		},
		twitter: {
			site: siteTitle,
			description,
			title,
			images: ogImage,
		},
		pinterest: {
			richPin: true,
		},
		applicationName: siteTitle,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_SITE_URL + doc?.link || '/',
		},
	}
}
