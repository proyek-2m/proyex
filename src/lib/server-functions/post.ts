'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Post, PostCategory } from '$payload-types'
import type { PaginatedDocs } from 'payload'

export type OptionsQueryPosts = Omit<Options<'posts', Record<keyof Post, true>>, 'collection'> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Post
	filter?: {
		ids?: number[]
		categoryIds?: number[]
		teamIds?: number[]
	}
}

export type OptionsQueryPostCategories = Omit<
	Options<'postCategories', Record<keyof PostCategory, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: PostCategory
	filter?: {
		ids?: number[]
	}
}

const fieldSearch = ['title', 'excerpt', 'meta.title', 'meta.description']

const fieldSearchPostCategories = ['title', 'excerpt', 'meta.title', 'meta.description']

export const queryPosts = async <T extends Partial<Record<keyof Post, true>> | undefined>(
	options?: OptionsQueryPosts,
	select?: T,
): Promise<PaginatedDocs<Pick<Post, T extends undefined ? keyof Post : keyof T>> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-publishedAt'
		const whereAnd: Where['and'] = options?.whereAnd || []
		const whereOr: Where['and'] = options?.whereOr || []

		if (options?.filter) {
			if (options.filter.ids?.length) {
				whereAnd.push({
					id: {
						in: options.filter.ids,
					},
				})
			}

			if (options.filter.categoryIds?.length) {
				whereAnd.push({
					category: {
						in: options.filter.categoryIds,
					},
				})
			}

			if (options.filter.teamIds?.length) {
				whereAnd.push({
					createdBy: {
						in: options.filter.teamIds,
					},
				})
			}
		}

		if (options?.search) {
			const whereSearch: Where['or'] = []

			fieldSearch.forEach((field) => {
				whereSearch.push({
					[field]: {
						contains: options.search,
					},
				})
			})

			whereAnd.push({
				or: whereSearch,
			})
		}

		if (options?.queried?.id) {
			whereAnd.push({
				id: {
					not_equals: options.queried.id,
				},
			})
		}

		whereAnd.push({
			_status: {
				equals: 'published',
			},
		})

		const result = await payload.find({
			collection: 'posts',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:posts')

		return result
	} catch (error) {
		console.error('Error fetching posts', { error })
		return null
	}
}

export type ResultPostCategories<T = PostCategory> =
	| (PaginatedDocs<T> & {
			totalPost: {
				categoryId: number
				total: number
			}[]
	  })
	| null

export type PostCategories = (PostCategory & { totalPost: number })[]

export const queryPostCategories = async <
	T extends Partial<Record<keyof PostCategory, true>> | undefined,
>(
	options?: OptionsQueryPostCategories,
	select?: T,
): Promise<
	ResultPostCategories<Pick<PostCategory, T extends undefined ? keyof PostCategory : keyof T>>
> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-publishedAt'
		const whereAnd: Where['and'] = options?.whereAnd || []
		const whereOr: Where['and'] = options?.whereOr || []

		if (options?.filter) {
			if (options.filter.ids?.length) {
				whereAnd.push({
					id: {
						in: options.filter.ids,
					},
				})
			}
		}

		if (options?.search) {
			const whereSearch: Where['or'] = []

			fieldSearchPostCategories.forEach((field) => {
				whereSearch.push({
					[field]: {
						contains: options.search,
					},
				})
			})

			whereAnd.push({
				or: whereSearch,
			})
		}

		if (options?.queried?.id) {
			whereAnd.push({
				id: {
					not_equals: options.queried.id,
				},
			})
		}

		whereAnd.push({
			_status: {
				equals: 'published',
			},
		})

		const result = await payload.find({
			collection: 'postCategories',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		const totalPost: {
			categoryId: number
			total: number
		}[] = []

		if (result.docs) {
			await Promise.all(
				result.docs.map(async (doc) => {
					const posts = await payload.count({
						collection: 'posts',
						where: {
							['category']: {
								equals: doc.id,
							},
						},
					})

					totalPost.push({
						categoryId: doc.id,
						total: posts.totalDocs,
					})
				}),
			)
		}

		cacheTag('collection', 'collection:postCategories')

		return {
			...result,
			totalPost,
		}
	} catch (error) {
		console.error('Error fetching postCategories', { error })
		return null
	}
}
