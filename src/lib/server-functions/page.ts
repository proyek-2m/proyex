'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Page } from '$payload-types'

export type OptionsQueryPages = Omit<Options<'pages', Record<keyof Page, true>>, 'collection'> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
}

export const queryPages = async <T extends Partial<Record<keyof Page, true>> | undefined>(
	options?: OptionsQueryPages,
	select?: T,
): Promise<PaginatedDocs<Pick<Page, T extends undefined ? keyof Page : keyof T>> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-publishedAt'
		const whereAnd: Where['and'] = options?.whereAnd || []
		const whereOr: Where['and'] = options?.whereOr || []

		whereAnd.push({
			_status: {
				equals: 'published',
			},
		})

		const result = await payload.find({
			collection: 'pages',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:pages')

		return result
	} catch (error) {
		console.error('Error fetching pages', { error })
		return null
	}
}
