'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { Client, ClientStorySlider as ClientStorySliderBlock } from '$payload-types'
import { type OptionsQueryClients, queryClients } from '$server-functions/client'
import ClientStorySliderClient from './client'

export type ClientStorySliderProps = {
	block: ClientStorySliderBlock | Omit<ClientStorySliderBlock, 'blockType'>
	queried?: Client
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingClients = Omit<OptionsQueryClients, 'whereAnd' | 'whereOr'>

export const queryListingClient = async (
	block: ClientStorySliderProps['block'],
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
			representationAvatar: true,
			representationName: true,
			representationPosition: true,
			link: true,
			slug: true,
			story: true,
		},
	)

	return result?.docs || []
}

export default async function ClientStorySlider({
	block,
	queried,
	...props
}: ClientStorySliderProps) {
	const clients = await queryListingClient(block, queried)

	return (
		<ClientStorySliderClient
			{...props}
			block={block}
			clients={clients}
		/>
	)
}
