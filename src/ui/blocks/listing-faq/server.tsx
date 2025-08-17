'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { Faq, ListingFaq as ListingFaqBlock } from '$payload-types'
import { type OptionsQueryFaqs, queryFaqs } from '$server-functions/faq'
import ListingFaqClient from './client'

export type ListingFaqProps = {
	block: ListingFaqBlock
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingFaqs = Omit<OptionsQueryFaqs, 'whereAnd' | 'whereOr'>

export const queryListingFaq = async (
	block: ListingFaqBlock,
	options?: OptionsQueryListingFaqs,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryFaqs['search'] = options?.search
	let limit = options?.limit || block.total || 12
	const faqIds: number[] = []
	const faqTypes: NonNullable<Faq['type']> = []

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

	if (block.type === 'selectedFaqs' && block.selectedFaqs && !options?.filter?.ids) {
		limit = 100000
		block.selectedFaqs.forEach((faq) => {
			if (typeof faq === 'number') {
				faqIds.push(faq)
			} else if (typeof faq === 'object' && faq.id) {
				faqIds.push(faq.id)
			}
		})

		if (faqIds.length === 0) {
			return null
		}
	} else if (block.type === 'selectedTypes' && block.selectedTypes && !options?.filter?.types) {
		block.selectedTypes.forEach((faqType) => {
			faqTypes.push(faqType)
		})

		if (faqTypes.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	const resultFaqs = await queryFaqs(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || faqIds,
				types: options?.filter?.types || faqTypes,
			},
		},
		{
			title: true,
			message: true,
		},
	)

	return resultFaqs
}

export default async function ListingFaq({ block, ...props }: ListingFaqProps) {
	const resultFaqs = await queryListingFaq(block)

	return (
		<ListingFaqClient
			{...props}
			block={block}
			initialResult={resultFaqs}
		/>
	)
}
