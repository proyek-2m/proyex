'use server'
import { cacheTag } from 'next/cache'
import { headers as getHeaders } from 'next/headers'
import type { Options as FindOneOptions } from 'node_modules/payload/dist/globals/operations/local/findOne'
import { getPayload } from 'payload'

import configPromise from '$payload-config'
import type { Config, Site } from '$payload-types'

export const getAuthUser = async () => {
	const headers = await getHeaders()
	const payload = await getPayload({ config: configPromise })
	const { user } = await payload.auth({ headers })

	return user
}

const getGlobal = async <T extends keyof Config['globals']>(
	options: FindOneOptions<
		T,
		Record<keyof Config['globals'][T], true> | Record<keyof Config['globals'][T], false>
	>,
): Promise<Config['globals'][T] | null> => {
	try {
		const payload = await getPayload({ config: configPromise })

		const global = await payload.findGlobal(options)

		// @ts-expect-error
		return global
	} catch (error) {
		console.error('getGlobal', { error })

		return null
	}
}

export const getSiteGlobal = async (
	options?: Omit<
		FindOneOptions<'site', Record<keyof Site, true> | Record<keyof Site, false>>,
		'slug'
	>,
) => {
	'use cache'

	const result = await getGlobal({ ...options, slug: 'site' })

	if (result) {
		cacheTag('global', 'global:site')
		return result
	}

	return null
}

export const postSitemap = async () => {
	'use cache'
	try {
		cacheTag('sitemap', 'sitemap:posts')

		const payload = await getPayload({ config: configPromise })
		const posts = await payload.find({
			collection: 'posts',
			draft: false,
			limit: 100000,
			overrideAccess: false,
			pagination: false,
			where: {
				_status: {
					equals: 'published',
				},
			},
			select: {
				title: true,
				slug: true,
				link: true,
				category: true,
				updatedAt: true,
			},
		})

		return posts.docs
	} catch (error) {
		console.error('postSitemap', { error })
		return []
	}
}

export const clientSitemap = async () => {
	'use cache'
	try {
		cacheTag('sitemap', 'sitemap:clients')

		const payload = await getPayload({ config: configPromise })
		const posts = await payload.find({
			collection: 'clients',
			draft: false,
			limit: 100000,
			overrideAccess: false,
			pagination: false,
			where: {
				_status: {
					equals: 'published',
				},
			},
			select: {
				title: true,
				slug: true,
				link: true,
				updatedAt: true,
			},
		})

		return posts.docs
	} catch (error) {
		console.error('clientSitemap', { error })
		return []
	}
}

export const pageSitemap = async () => {
	'use cache'
	try {
		cacheTag('sitemap', 'sitemap:pages')

		const payload = await getPayload({ config: configPromise })
		const posts = await payload.find({
			collection: 'pages',
			draft: false,
			limit: 100000,
			overrideAccess: false,
			pagination: false,
			where: {
				_status: {
					equals: 'published',
				},
			},
			select: {
				title: true,
				slug: true,
				link: true,
				parentPage: true,
				updatedAt: true,
			},
		})

		return posts.docs
	} catch (error) {
		console.error('pageSitemap', { error })
		return []
	}
}

export const postCategorySitemap = async () => {
	'use cache'
	try {
		cacheTag('sitemap', 'sitemap:postCategories')

		const payload = await getPayload({ config: configPromise })
		const posts = await payload.find({
			collection: 'postCategories',
			draft: false,
			limit: 100000,
			overrideAccess: false,
			pagination: false,
			where: {
				_status: {
					equals: 'published',
				},
			},
			select: {
				title: true,
				slug: true,
				link: true,
				updatedAt: true,
			},
		})

		return posts.docs
	} catch (error) {
		console.error('postCategorySitemap', { error })
		return []
	}
}

export const productSitemap = async () => {
	'use cache'
	try {
		cacheTag('sitemap', 'sitemap:products')

		const payload = await getPayload({ config: configPromise })
		const posts = await payload.find({
			collection: 'products',
			draft: false,
			limit: 100000,
			overrideAccess: false,
			pagination: false,
			where: {
				_status: {
					equals: 'published',
				},
			},
			select: {
				title: true,
				slug: true,
				link: true,
				updatedAt: true,
			},
		})

		return posts.docs
	} catch (error) {
		console.error('productSitemap', { error })
		return []
	}
}
