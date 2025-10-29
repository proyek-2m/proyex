'use server'
import { cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Reusable } from '$payload-types'

export type OptionsQueryReusables = Omit<
	Options<'reusables', Record<keyof Reusable, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
}

export const queryReusables = async <T extends Partial<Record<keyof Reusable, true>> | undefined>(
	options?: OptionsQueryReusables,
	select?: T,
): Promise<PaginatedDocs<
	Pick<Reusable, T extends undefined ? keyof Reusable : keyof T>
> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-publishedAt'
		const whereAnd: Where['and'] = options?.whereAnd || []
		const whereOr: Where['and'] = options?.whereOr || []

		const result = await payload.find({
			collection: 'reusables',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:reusables')

		return result
	} catch (error) {
		console.error('Error fetching reusables', { error })
		return null
	}
}
