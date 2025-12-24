'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { Client, ListingClient as ListingClientBlock } from '$payload-types'
import { type OptionsQueryClients, queryClients } from '$server-functions/client'
import ListingClientClient from './client'

export type ListingClientProps = {
	block: ListingClientBlock | Omit<ListingClientBlock, 'blockType'>
	queried?: Client
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingClients = Omit<OptionsQueryClients, 'whereAnd' | 'whereOr'>

export const queryListingClient = async (
	block: ListingClientProps['block'],
	options?: OptionsQueryListingClients,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryClients['search'] = options?.search
	let limit = options?.limit || block.total || 6
	const clientIds: number[] = []

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

	if (block.type === 'selectedClients' && block.selectedClients && !options?.filter?.ids) {
		limit = 100000

		block.selectedClients.forEach((client) => {
			if (typeof client === 'number') {
				clientIds.push(client)
			} else if (typeof client === 'object' && client.id) {
				clientIds.push(client.id)
			}
		})

		if (clientIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryClients(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || clientIds,
			},
		},
		{
			name: true,
			logo: true,
			landscapeImage: true,
			representationName: true,
			representationPosition: true,
			representationAvatar: true,
			story: true,
			title: true,
			link: true,
			slug: true,
			excerpt: true,
			featuredImage: true,
		},
	)
}

export default async function ListingClient({ block, queried, ...props }: ListingClientProps) {
	const resultClients = await queryListingClient(block, {
		queried,
	})

	return (
		<ListingClientClient
			{...props}
			block={block}
			initialResult={resultClients}
			queried={queried}
		/>
	)
}
