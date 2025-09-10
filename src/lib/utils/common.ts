import type { Asset } from '$payload-types'

export function isServer() {
	return typeof window === 'undefined'
}

export function slugify(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/^\s+|\s+$/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
}

export function assetUrl(asset: number | Asset | null | undefined): string | undefined {
	if (!asset) return undefined

	if (typeof asset === 'number') return `/api/media/${asset}`

	if (asset.url) return asset.url

	return undefined
}

export function collectionLink(link?: string | null) {
	if (!link) return '#'

	return link
}
