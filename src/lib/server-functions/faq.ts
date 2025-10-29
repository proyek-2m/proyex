'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Faq } from '$payload-types'

export type OptionsQueryFaqs = Omit<Options<'faqs', Record<keyof Faq, true>>, 'collection'> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	filter?: {
		ids?: number[]
		types?: NonNullable<Faq['type']>
	}
}

const fieldSearch = ['title']

export const queryFaqs = async <T extends Partial<Record<keyof Faq, true>> | undefined>(
	options?: OptionsQueryFaqs,
	select?: T,
): Promise<PaginatedDocs<Pick<Faq, T extends undefined ? keyof Faq : keyof T>> | null> => {
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

			if (options.filter.types?.length) {
				whereAnd.push({
					type: {
						in: options.filter.types,
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

		const result = await payload.find({
			collection: 'faqs',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:faqs')

		return result
	} catch (error) {
		console.error('Error fetching faqs', { error })
		return null
	}
}
