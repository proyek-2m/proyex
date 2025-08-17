'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Sort, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Template } from '$payload-types'

export type OptionsQueryTemplates = Omit<
	Options<'templates', Record<keyof Template, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Template
	filter?: {
		ids?: number[]
		teamIds?: number[]
		serviceIds?: number[]
	}
}

const fieldSearch = ['title', 'excerpt', 'meta.title', 'meta.description']

export const queryTemplates = async <T extends Partial<Record<keyof Template, true>> | undefined>(
	options?: OptionsQueryTemplates,
	select?: T,
): Promise<PaginatedDocs<
	Pick<Template, T extends undefined ? keyof Template : keyof T>
> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort: Sort = ['available']
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

			if (options.filter.teamIds?.length) {
				whereAnd.push({
					teams: {
						in: options.filter.teamIds,
					},
				})
			}

			if (options.filter.serviceIds?.length) {
				whereAnd.push({
					services: {
						in: options.filter.serviceIds,
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

		if (options?.queried) {
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

		if (options?.sort) {
			if (Array.isArray(options.sort)) {
				sort.push(...options.sort)
			} else {
				sort.push(options.sort)
			}
		} else {
			sort.push('-publishedAt')
		}

		const result = await payload.find({
			collection: 'templates',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:templates')

		return result
	} catch (error) {
		console.error('Error fetching templates', { error })
		return null
	}
}
