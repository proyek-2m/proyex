'use client'
import { Button, Center, Loader, Pagination, Skeleton, Stack, Text } from '@mantine/core'
import type { PaginatedDocs } from 'payload'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { ProductGrid, SkeletonProductGrid, type ProductGridProps } from '$layouts/Product'
import { slugify } from '$utils/common'
import {
	queryListingProduct,
	type ListingProductProps,
	type OptionsQueryListingProducts,
} from './server'

import styles from '$styles/blocks/listing-product.module.css'

export type ListingProductClientProps = ListingProductProps & {
	initialResult: PaginatedDocs<ProductGridProps['data']> | null
}

export default function ListingProductClient({
	block,
	initialResult,
	queried,
	withContainer,
	...props
}: ListingProductClientProps) {
	if (!withContainer) {
		return (
			<ListingProductInner
				{...props}
				block={block}
				initialResult={initialResult}
				queried={queried}
			/>
		)
	}

	return (
		<section
			{...props}
			id={block.blockName || props.id}
			data-slot="listing-product"
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingProductInner
						block={block}
						initialResult={initialResult}
						queried={queried}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

export function ListingProductInner({
	block,
	initialResult,
	queried,
	...props
}: Omit<ListingProductClientProps, 'withContainer'>) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingProducts | null>(null)
	const [prevProducts, setPrevProducts] = useState<ProductGridProps['data'][]>([])
	const [resultProducts, setResultProducts] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 3
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '40px',
			vertical: block.gap?.vertical || block.gap?.base || '40px',
		}
	}, [block.gap])

	const posts = useMemo(() => {
		if (!resultProducts) {
			return []
		}

		return resultProducts?.docs
	}, [resultProducts])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultProducts) {
			return null
		}

		return resultProducts
	}, [block, resultProducts])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevProducts = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevProducts([...prevProducts, ...posts])
			} else {
				setPrevProducts([])
			}
		},
		[isCountinuePagination, prevProducts, posts],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevProducts()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevProducts, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setResultProducts(null)

			startTransition(async () => {
				const resultProduct = await queryListingProduct(block, {
					...queryParams,
					queried,
				})

				setResultProducts(resultProduct)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-product-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			{!posts.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Layanan tidak ditemukan
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevProducts={prevProducts}
					posts={posts}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					posts={posts}
					prevProducts={prevProducts}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					block={block}
					posts={posts}
					loading={isLoading}
				/>
			)}

			<PaginationListing
				block={block}
				data={pagination}
				loading={isLoading}
				onPaging={handlerPagination}
				className="mt-10"
			/>

			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}

function ListingDefault({
	block,
	posts,
	loading,
}: Pick<ListingProductClientProps, 'block'> & {
	posts: ProductGridProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading) {
		return (
			<div className={styles.listing}>
				<SkeletonItems
					loading={loading}
					total={block.column || 6}
				/>
			</div>
		)
	}

	if (posts.length) {
		return (
			<div className={styles.listing}>
				{posts.map((post, index) => (
					<ProductGrid
						data={post}
						key={`${compId}-post-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevProducts,
	posts,
	loading,
}: {
	column: number
	prevProducts: ProductGridProps['data'][]
	posts: ProductGridProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || posts.length || prevProducts.length) {
		return (
			<div className={styles.listing}>
				{prevProducts.map((post, index) => (
					<ProductGrid
						key={`${compId}-prevpost-${index}`}
						data={post}
					/>
				))}
				{posts.map((post, index) => (
					<ProductGrid
						data={post}
						key={`${compId}-post-${index}`}
					/>
				))}
				<SkeletonItems
					loading={loading}
					total={column}
				/>
			</div>
		)
	}

	return null
}

function ListingInfiniteScroll({
	column,
	prevProducts,
	posts,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevProducts: ProductGridProps['data'][]
	posts: ProductGridProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<ProductGridProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevProducts.length + posts.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevProducts.map((post, index) => (
					<ProductGrid
						key={`${compId}-prevpost-${index}`}
						data={post}
					/>
				))}
				{posts.map((post, index) => (
					<ProductGrid
						data={post}
						key={`${compId}-post-${index}`}
					/>
				))}
			</InfiniteScroll>

			{pagination?.hasNextPage || loading ? (
				<Stack
					gap="var(--gap)"
					mt={{
						base: '24px',
						md: 'var(--gap-y)',
					}}
				>
					<div className={styles.listing}>
						<SkeletonItems
							loading={loading}
							total={column}
						/>
					</div>
					<Center>
						<Loader size="md" />
					</Center>
				</Stack>
			) : null}
		</>
	)
}

function SkeletonItems({ loading, total }: { loading?: boolean; total?: number }) {
	const compId = useId()

	if (!loading) {
		return null
	}

	return Array.from({
		length: total || 6,
	}).map((_, index) => <SkeletonProductGrid key={`${compId}-${index}`} />)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingProductClientProps, 'block'> & {
	data: PaginatedDocs<ProductGridProps['data']> | null
	loading?: boolean
	onPaging: (value: number) => void
	className?: string
}) {
	if (block.pagination === 'load-more' && (data?.hasNextPage || loading)) {
		return (
			<Center className={className}>
				{data?.hasNextPage ? (
					<Button
						size="lg"
						variant="light"
						loading={loading}
						onClick={() => {
							if (data.nextPage) {
								onPaging(data.nextPage)
							}
						}}
					>
						Muat lebih banyak
					</Button>
				) : loading ? (
					<Button
						size="lg"
						variant="light"
						rightSection={<Loader size="xs" />}
					>
						Loading...
					</Button>
				) : null}
			</Center>
		)
	}

	if (block.pagination === 'paged' && (data?.totalPages || loading)) {
		return (
			<Center className={className}>
				{data?.totalPages && data?.totalPages > 1 ? (
					<Pagination
						value={data.page}
						total={data.totalPages}
						onChange={onPaging}
					/>
				) : loading ? (
					<Skeleton
						w={280}
						maw="100%"
						h={32}
					/>
				) : null}
			</Center>
		)
	}
}
