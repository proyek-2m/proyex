'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingTeam as ListingTeamBlock, Team } from '$payload-types'
import { type OptionsQueryTeams, queryTeamPositions, queryTeams } from '$server-functions/team'
import ListingTeamClient from './client'

export type ListingTeamProps = {
	block: ListingTeamBlock | Omit<ListingTeamBlock, 'blockType'>
	queried?: Team
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingTeams = Omit<OptionsQueryTeams, 'whereAnd' | 'whereOr'>

export const queryListingTeam = async (
	block: ListingTeamProps['block'],
	options?: OptionsQueryListingTeams,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryTeams['search'] = options?.search
	let limit = options?.limit || block.total || 8
	const teamIds: number[] = []
	const positionIds: number[] = []
	let gender: Team['gender'] = options?.filter?.gender
	const levels: NonNullable<Team['level']>[] = []

	if (options?.sort) {
		sort = options.sort
	} else {
		sort = block.order === 'DESC' ? '-' : ''

		if (block.orderBy === 'date') {
			sort += 'publishedAt'
		} else {
			sort += 'title'
		}
	}

	if (block.type === 'selectedTeams' && block.selectedTeams && !options?.filter?.ids) {
		limit = 100000

		block.selectedTeams.forEach((team) => {
			if (typeof team === 'number') {
				teamIds.push(team)
			} else if (typeof team === 'object' && team.id) {
				teamIds.push(team.id)
			}
		})

		if (teamIds.length === 0) {
			return null
		}
	} else if (
		block.type === 'selectedPositions' &&
		block.selectedPositions &&
		!options?.filter?.positionIds
	) {
		block.selectedPositions.forEach((position) => {
			if (typeof position === 'object') {
				positionIds.push(position.id)
			} else {
				positionIds.push(position)
			}
		})

		if (positionIds.length === 0) {
			return null
		}
	} else if (block.type === 'selectedGender' && block.selectedGender && !gender) {
		gender = block.selectedGender
	} else if (
		block.type === 'selectedLevels' &&
		block.selectedLevels &&
		!options?.filter?.levels
	) {
		block.selectedLevels.forEach((level) => {
			levels.push(level)
		})

		if (levels.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryTeams(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || teamIds,
				positionIds: options?.filter?.positionIds || positionIds,
				gender,
				levels: options?.filter?.levels || levels,
			},
		},
		{
			link: true,
			slug: true,
			title: true,
			gender: true,
			featuredImage: true,
			avatar: true,
			positions: true,
		},
	)
}

const queryListingPositions = async (block: ListingTeamProps['block']) => {
	if (!block.showFilter) {
		return null
	}

	return await queryTeamPositions(
		{
			limit: 1000000,
			pagination: false,
		},
		{
			id: true,
			title: true,
		},
	)
}

export default async function ListingTeam({ block, queried, ...props }: ListingTeamProps) {
	const [resultTeams, resultPositions] = await Promise.all([
		queryListingTeam(block, {
			queried,
		}),
		queryListingPositions(block),
	])

	return (
		<ListingTeamClient
			{...props}
			block={block}
			initialResult={resultTeams}
			positions={resultPositions}
			queried={queried}
		/>
	)
}
