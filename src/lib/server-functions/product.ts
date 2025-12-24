'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Product } from '$payload-types'

export type OptionsQueryProducts = Omit<
	Options<'products', Record<keyof Product, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Product
	filter?: {
		ids?: number[]
	}
}

const fieldSearch = ['title', 'excerpt', 'meta.title', 'meta.description']

export const queryProducts = async <T extends Partial<Record<keyof Product, true>> | undefined>(
	options?: OptionsQueryProducts,
	select?: T,
): Promise<PaginatedDocs<Pick<Product, T extends undefined ? keyof Product : keyof T>> | null> => {
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
					not_equals: options?.queried?.id,
				},
			})
		}

		whereAnd.push({
			_status: {
				equals: 'published',
			},
		})

		const result = await payload.find({
			collection: 'products',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:products')

		return result
	} catch (error) {
		console.error('Error fetching products', { error })
		return null
	}
}
