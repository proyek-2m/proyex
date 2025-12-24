'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingPost as ListingPostBlock, Post } from '$payload-types'
import { type OptionsQueryPosts, queryPostCategories, queryPosts } from '$server-functions/post'
import ListingPostClient from './client'

export type ListingPostProps = {
	block: ListingPostBlock | Omit<ListingPostBlock, 'blockType'>
	queried?: Post
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingPosts = Omit<OptionsQueryPosts, 'whereAnd' | 'whereOr'>

export const queryListingPost = async (
	block: ListingPostProps['block'],
	options?: OptionsQueryListingPosts,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryPosts['search'] = options?.search
	let limit = options?.limit || block.total || 6
	const postIds: number[] = []
	const categoryIds: number[] = []

	if (options?.sort) {
		sort = options.sort
	} else {
		sort = block.order === 'DESC' ? '-' : ''

		if (block.orderBy === 'title') {
			sort += 'title'
		} else {
			sort += 'publishedAt'
		}
	}

	if (block.type === 'selectedPosts' && block.selectedPosts && !options?.filter?.ids) {
		limit = 100000

		block.selectedPosts.forEach((post) => {
			if (typeof post === 'number') {
				postIds.push(post)
			} else if (typeof post === 'object' && post.id) {
				postIds.push(post.id)
			}
		})

		if (postIds.length === 0) {
			return null
		}
	} else if (
		block.type === 'selectedCategories' &&
		block.selectedCategories &&
		!options?.filter?.categoryIds
	) {
		block.selectedCategories.forEach((category) => {
			if (typeof category === 'object') {
				categoryIds.push(category.id)
			} else {
				categoryIds.push(category)
			}
		})

		if (categoryIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryPosts(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || postIds,
				categoryIds: options?.filter?.categoryIds || categoryIds,
			},
		},
		{
			createdBy: true,
			title: true,
			link: true,
			slug: true,
			excerpt: true,
			featuredImage: true,
			category: true,
		},
	)
}

const queryListingCategories = async (block: ListingPostProps['block']) => {
	if (!block.showFilter) {
		return null
	}

	return await queryPostCategories(
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

export default async function ListingPost({ block, queried, ...props }: ListingPostProps) {
	const resultPosts = await queryListingPost(block, {
		queried,
	})
	const resultCategories = await queryListingCategories(block)

	return (
		<ListingPostClient
			{...props}
			block={block}
			initialResult={resultPosts}
			categories={resultCategories}
			queried={queried}
		/>
	)
}
