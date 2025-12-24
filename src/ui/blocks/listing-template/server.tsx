'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingTemplate as ListingTemplateBlock, Template } from '$payload-types'
import { queryServices } from '$server-functions/service'
import { type OptionsQueryTemplates, queryTemplates } from '$server-functions/template'
import ListingTemplateClient from './client'

export type ListingTemplateProps = {
	block: ListingTemplateBlock | Omit<ListingTemplateBlock, 'blockType'>
	queried?: Template
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingTemplates = Omit<OptionsQueryTemplates, 'whereAnd' | 'whereOr'>

export const queryListingTemplate = async (
	block: ListingTemplateProps['block'],
	options?: OptionsQueryListingTemplates,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryTemplates['search'] = options?.search
	let limit = options?.limit || block.total || 6
	const templateIds: number[] = []
	const serviceIds: number[] = []
	const teamIds: number[] = []

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

	if (block.type === 'selectedTemplates' && block.selectedTemplates && !options?.filter?.ids) {
		limit = 100000

		block.selectedTemplates.forEach((template) => {
			if (typeof template === 'number') {
				templateIds.push(template)
			} else if (typeof template === 'object' && template.id) {
				templateIds.push(template.id)
			}
		})

		if (templateIds.length === 0) {
			return null
		}
	} else if (
		block.type === 'selectedServices' &&
		block.selectedServices &&
		!options?.filter?.serviceIds
	) {
		block.selectedServices.forEach((service) => {
			if (typeof service === 'object') {
				serviceIds.push(service.id)
			} else {
				serviceIds.push(service)
			}
		})

		if (serviceIds.length === 0) {
			return null
		}
	} else if (block.type === 'selectedTeams' && block.selectedTeams && !options?.filter?.teamIds) {
		block.selectedTeams.forEach((team) => {
			if (typeof team === 'object') {
				teamIds.push(team.id)
			} else {
				teamIds.push(team)
			}
		})

		if (teamIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryTemplates(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || templateIds,
				serviceIds: options?.filter?.serviceIds || serviceIds,
				teamIds: options?.filter?.teamIds || teamIds,
			},
		},
		{
			title: true,
			link: true,
			slug: true,
			featuredImage: true,
			services: true,
			available: true,
		},
	)
}

const queryListingServices = async (block: ListingTemplateProps['block']) => {
	if (!block.showFilter) {
		return null
	}

	return await queryServices(
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

export default async function ListingTemplate({ block, queried, ...props }: ListingTemplateProps) {
	const [resultTemplates, resultServices] = await Promise.all([
		queryListingTemplate(block, {
			queried,
		}),
		queryListingServices(block),
	])

	return (
		<ListingTemplateClient
			{...props}
			block={block}
			initialResult={resultTemplates}
			services={resultServices}
			queried={queried}
		/>
	)
}
