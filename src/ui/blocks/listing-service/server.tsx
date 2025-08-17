'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingService as ListingServiceBlock, Service } from '$payload-types'
import { type OptionsQueryServices, queryServices } from '$server-functions/service'
import ListingServiceClient from './client'

export type ListingServiceProps = {
	block: ListingServiceBlock | Omit<ListingServiceBlock, 'blockType'>
	queried?: Service
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingServices = Omit<OptionsQueryServices, 'whereAnd' | 'whereOr'>

export const queryListingService = async (
	block: ListingServiceProps['block'],
	options?: OptionsQueryListingServices,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryServices['search'] = options?.search
	let limit = options?.limit || block.total || 100000
	const serviceIds: number[] = []

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

	if (block.type === 'selectedServices' && block.selectedServices && !options?.filter?.ids) {
		limit = 100000

		block.selectedServices.forEach((service) => {
			if (typeof service === 'number') {
				serviceIds.push(service)
			} else if (typeof service === 'object' && service.id) {
				serviceIds.push(service.id)
			}
		})

		if (serviceIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryServices(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || serviceIds,
			},
		},
		{
			title: true,
			link: true,
			slug: true,
			excerpt: true,
			featuredImage: true,
		},
	)
}

export default async function ListingService({ block, queried, ...props }: ListingServiceProps) {
	const resultServices = await queryListingService(block, {
		queried,
	})

	return (
		<ListingServiceClient
			{...props}
			block={block}
			initialResult={resultServices}
			queried={queried}
		/>
	)
}
