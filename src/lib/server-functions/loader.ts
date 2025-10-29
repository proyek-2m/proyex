'use server'
import { cacheTag } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import { slugHomepage } from '$modules/vars'
import configPromise from '$payload-config'
import { linkCollection } from '$payload-libs/link-utils'

export const postLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPost = slug[slug.length - 1]

	const getPost = await payload.find({
		collection: 'posts',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPost,
			},
		},
	})

	if (getPost.docs.length) {
		const postLink = slug.join('/')
		const post = getPost.docs[0]

		if (
			!draft &&
			post &&
			`/${postLink}` !==
				linkCollection({
					collection: 'posts',
					doc: post,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:posts')

		return post
	}

	return null
}

export const postCategoryLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPostCategory = slug[slug.length - 1]

	const getPostCategory = await payload.find({
		collection: 'postCategories',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPostCategory,
			},
		},
	})

	if (getPostCategory.docs.length) {
		const postCategoryLink = slug.join('/')
		const postCategory = getPostCategory.docs[0]

		if (
			!draft &&
			postCategory &&
			`/${postCategoryLink}` !==
				linkCollection({
					collection: 'postCategories',
					doc: postCategory,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:postCategories')

		return postCategory
	}

	return null
}

export const clientLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugClient = slug[slug.length - 1]

	const getClient = await payload.find({
		collection: 'clients',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugClient,
			},
		},
	})

	if (getClient.docs.length) {
		const clientLink = slug.join('/')
		const client = getClient.docs[0]

		if (
			!draft &&
			client &&
			`/${clientLink}` !==
				linkCollection({
					collection: 'clients',
					doc: client,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:clients')

		return client
	}

	return null
}

export const pageLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPage = slug[slug.length - 1]

	const getPage = await payload.find({
		collection: 'pages',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPage,
			},
		},
	})

	if (getPage.docs.length) {
		const pageLink = slug.join('/')
		const page = getPage.docs[0]
		const pageLinkResult = linkCollection({
			collection: 'pages',
			doc: page,
		})

		if (page) {
			if (!draft && pageLink !== slugHomepage && `/${pageLink}` !== pageLinkResult) {
				return null
			}

			cacheTag('collection', 'collection:pages')

			return page
		}
	}

	return null
}

export const serviceLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugService = slug[slug.length - 1]

	const getService = await payload.find({
		collection: 'services',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugService,
			},
		},
	})

	if (getService.docs.length) {
		const serviceLink = slug.join('/')
		const service = getService.docs[0]

		if (
			!draft &&
			service &&
			`/${serviceLink}` !==
				linkCollection({
					collection: 'services',
					doc: service,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:services')

		return service
	}

	return null
}

export const teamLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugTeam = slug[slug.length - 1]

	const getTeam = await payload.find({
		collection: 'teams',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugTeam,
			},
		},
	})

	if (getTeam.docs.length) {
		const teamLink = slug.join('/')
		const team = getTeam.docs[0]

		if (
			!draft &&
			team &&
			`/${teamLink}` !==
				linkCollection({
					collection: 'teams',
					doc: team,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:teams')

		return team
	}

	return null
}

export const teamPositionLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugTeamPosition = slug[slug.length - 1]

	const getTeamPosition = await payload.find({
		collection: 'teamPositions',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugTeamPosition,
			},
		},
	})

	if (getTeamPosition.docs.length) {
		const teamPositionLink = slug.join('/')
		const teamPosition = getTeamPosition.docs[0]

		if (
			!draft &&
			teamPosition &&
			`/${teamPositionLink}` !==
				linkCollection({
					collection: 'teamPositions',
					doc: teamPosition,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:teamPositions')

		return teamPosition
	}

	return null
}

export const templateLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugTemplate = slug[slug.length - 1]

	const getTemplate = await payload.find({
		collection: 'templates',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugTemplate,
			},
		},
	})

	if (getTemplate.docs.length) {
		const templateLink = slug.join('/')
		const template = getTemplate.docs[0]

		if (
			!draft &&
			template &&
			`/${templateLink}` !==
				linkCollection({
					collection: 'templates',
					doc: template,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:templates')

		return template
	}

	return null
}

export const reusableLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugReusable = slug[slug.length - 1]

	const getReusable = await payload.find({
		collection: 'reusables',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugReusable,
			},
		},
	})

	if (getReusable.docs.length) {
		const reusableLink = slug.join('/')
		const reusable = getReusable.docs[0]

		if (
			!draft &&
			reusable &&
			`/${reusableLink}` !==
				linkCollection({
					collection: 'reusables',
					doc: reusable,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:reusables')

		return reusable
	}

	return null
}
