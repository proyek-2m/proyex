'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { Client, FeaturedListingClient as FeaturedListingClientBlock } from '$payload-types'
import { type OptionsQueryClients, queryClients } from '$server-functions/client'
import FeaturedListingClientClient from './client'

export type FeaturedListingClientProps = {
	block: FeaturedListingClientBlock | Omit<FeaturedListingClientBlock, 'blockType'>
	queried?: Client
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingClients = Omit<OptionsQueryClients, 'whereAnd' | 'whereOr'>

export const queryListingClient = async (
	block: FeaturedListingClientProps['block'],
	queried?: Client,
) => {
	let sort: Sort = block.order === 'DESC' ? '-' : ''
	let search: OptionsQueryClients['search']

	if (block.orderBy === 'date') {
		sort += 'publishedAt'
	} else {
		sort += 'title'
	}

	if (block.type === 'selectedClients' && block.selectedClients) {
		return block.selectedClients.filter((client) => typeof client === 'object')
	} else if (block.type === 'search' && block.search) {
		search = block.search
	}

	const result = await queryClients(
		{
			search,
			limit: block.total || 6,
			sort,
			queried,
		},
		{
			name: true,
			logo: true,
			title: true,
			link: true,
			slug: true,
		},
	)

	return result?.docs || []
}

export default async function FeaturedListingClient({
	block,
	queried,
	...props
}: FeaturedListingClientProps) {
	const clients = await queryListingClient(block, queried)

	return (
		<FeaturedListingClientClient
			{...props}
			block={block}
			clients={clients}
		/>
	)
}
