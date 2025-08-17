'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Team, TeamPosition } from '$payload-types'

export type OptionsQueryTeams = Omit<Options<'teams', Record<keyof Team, true>>, 'collection'> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Team
	filter?: {
		ids?: number[]
		positionIds?: number[]
		gender?: Team['gender']
		levels?: NonNullable<Team['level']>[]
	}
}

export type OptionsQueryTeamPositions = Omit<
	Options<'teamPositions', Record<keyof TeamPosition, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: TeamPosition
	filter?: {
		ids?: number[]
	}
}

const fieldSearch = ['title', 'excerpt', 'meta.title', 'meta.description', 'city', 'motivation']
const fieldSearchPosition = ['title', 'excerpt', 'meta.title', 'meta.description']

export const queryTeams = async <T extends Partial<Record<keyof Team, true>> | undefined>(
	options?: OptionsQueryTeams,
	select?: T,
): Promise<PaginatedDocs<Pick<Team, T extends undefined ? keyof Team : keyof T>> | null> => {
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

			if (options.filter.positionIds?.length) {
				whereAnd.push({
					positions: {
						in: options.filter.positionIds,
					},
				})
			}

			if (options.filter.gender) {
				whereAnd.push({
					gender: {
						equals: options.filter.gender,
					},
				})
			}

			if (options.filter.levels?.length) {
				whereAnd.push({
					level: {
						in: options.filter.levels,
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
			collection: 'teams',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:teams')

		return result
	} catch (error) {
		console.error('Error fetching teams', { error })
		return null
	}
}

export const queryTeamPositions = async <
	T extends Partial<Record<keyof TeamPosition, true>> | undefined,
>(
	options?: OptionsQueryTeamPositions,
	select?: T,
): Promise<PaginatedDocs<
	Pick<TeamPosition, T extends undefined ? keyof TeamPosition : keyof T>
> | null> => {
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

			fieldSearchPosition.forEach((field) => {
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
			collection: 'teamPositions',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:teamPositions')

		return result
	} catch (error) {
		console.error('Error fetching teamPositions', { error })
		return null
	}
}
