'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingPostCategory as ListingPostCategoryBlock, PostCategory } from '$payload-types'
import { type OptionsQueryPostCategories, queryPostCategories } from '$server-functions/post'
import ListingPostCategoryClient from './client'

export type ListingPostCategoryProps = {
	block: ListingPostCategoryBlock | Omit<ListingPostCategoryBlock, 'blockType'>
	queried?: PostCategory
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingPostCategories = Omit<
	OptionsQueryPostCategories,
	'whereAnd' | 'whereOr'
>

export const queryListingPostCategory = async (
	block: ListingPostCategoryProps['block'],
	options?: OptionsQueryListingPostCategories,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryPostCategories['search'] = options?.search
	let limit = options?.limit || block.total || 100000
	const categoryIds: number[] = []

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

	if (block.type === 'selectedCategories' && block.selectedCategories && !options?.filter?.ids) {
		limit = 100000

		block.selectedCategories.forEach((category) => {
			if (typeof category === 'number') {
				categoryIds.push(category)
			} else if (typeof category === 'object') {
				categoryIds.push(category.id)
			}
		})

		if (categoryIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryPostCategories(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || categoryIds,
			},
		},
		{
			id: true,
			title: true,
			link: true,
			slug: true,
		},
	)
}

export default async function ListingPostCategory({
	block,
	queried,
	...props
}: ListingPostCategoryProps) {
	const resultPostCategories = await queryListingPostCategory(block, {
		queried,
	})

	return (
		<ListingPostCategoryClient
			{...props}
			block={block}
			initialResult={resultPostCategories}
			queried={queried}
		/>
	)
}
