'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingProduct as ListingProductBlock, Product } from '$payload-types'
import { type OptionsQueryProducts, queryProducts } from '$server-functions/product'
import ListingProductClient from './client'

export type ListingProductProps = {
	block: ListingProductBlock | Omit<ListingProductBlock, 'blockType'>
	queried?: Product
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingProducts = Omit<OptionsQueryProducts, 'whereAnd' | 'whereOr'>

export const queryListingProduct = async (
	block: ListingProductProps['block'],
	options?: OptionsQueryListingProducts,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryProducts['search'] = options?.search
	let limit = options?.limit || block.total || 100000
	const productIds: number[] = []

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

	if (block.type === 'selectedProducts' && block.selectedProducts && !options?.filter?.ids) {
		limit = 100000

		block.selectedProducts.forEach((product) => {
			if (typeof product === 'number') {
				productIds.push(product)
			} else if (typeof product === 'object' && product.id) {
				productIds.push(product.id)
			}
		})

		if (productIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryProducts(
		{
			...options,
			search,
			limit,
			sort,
			filter: {
				...options?.filter,
				ids: options?.filter?.ids || productIds,
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

export default async function ListingProduct({ block, queried, ...props }: ListingProductProps) {
	const resultProducts = await queryListingProduct(block, {
		queried,
	})

	return (
		<ListingProductClient
			{...props}
			block={block}
			initialResult={resultProducts}
			queried={queried}
		/>
	)
}
