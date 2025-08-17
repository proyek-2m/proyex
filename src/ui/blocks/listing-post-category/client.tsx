'use client'
import { Button, Center, Loader, Pagination, Skeleton, Stack, Text } from '@mantine/core'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { BlogCategoryCard, SkeletonBlogCard, type BlogCategoryCardProps } from '$layouts/Blog'
import type { ResultPostCategories } from '$server-functions/post'
import { slugify } from '$utils/common'
import { cx, gapVars, type GapBlock } from '$utils/styles'
import {
	queryListingPostCategory,
	type ListingPostCategoryProps,
	type OptionsQueryListingPostCategories,
} from './server'

import styles from '$styles/blocks/listing-post-category.module.css'

export type ListingPostCategoryClientProps = ListingPostCategoryProps & {
	initialResult: ResultPostCategories<Omit<BlogCategoryCardProps['data'], 'totalPost'>>
}

export default function ListingPostCategoryClient({
	block,
	initialResult,
	queried,
	withContainer,
	...props
}: ListingPostCategoryClientProps) {
	if (!withContainer) {
		return (
			<ListingPostCategoryInner
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
			data-slot="listing-post-category"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingPostCategoryInner
						block={block}
						initialResult={initialResult}
						queried={queried}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingPostCategoryInner({
	block,
	initialResult,
	queried,
	...props
}: Omit<ListingPostCategoryClientProps, 'withContainer'>) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingPostCategories | null>(null)
	const [prevPostCategorys, setPrevPostCategorys] = useState<BlogCategoryCardProps['data'][]>([])
	const [resultPostCategories, setResultPostCategorys] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 4
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '12px',
			vertical: block.gap?.vertical || block.gap?.base || '12px',
		}
	}, [block.gap])

	const categories = useMemo(() => {
		if (!resultPostCategories) {
			return []
		}

		return resultPostCategories.docs.map((doc) => {
			const totalPost = resultPostCategories.totalPost.find(
				(item) => item.categoryId === doc.id,
			)

			return { ...doc, totalPost: totalPost?.total || 0 }
		})
	}, [resultPostCategories])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultPostCategories) {
			return null
		}

		return resultPostCategories
	}, [block, resultPostCategories])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevPostCategorys = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevPostCategorys([...prevPostCategorys, ...categories])
			} else {
				setPrevPostCategorys([])
			}
		},
		[isCountinuePagination, prevPostCategorys, categories],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevPostCategorys()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevPostCategorys, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultPostCategorys(null)

			startTransition(async () => {
				const resultPostCategory = await queryListingPostCategory(block, {
					...queryParams,
					queried,
				})

				setResultPostCategorys(resultPostCategory)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-post-category-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			{!categories.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Blog kategori tidak ditemukan.
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					gap={gap}
					prevPostCategorys={prevPostCategorys}
					categories={categories}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					gap={gap}
					categories={categories}
					prevPostCategorys={prevPostCategorys}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					gap={gap}
					block={block}
					categories={categories}
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
	gap,
	block,
	categories,
	loading,
}: Pick<ListingPostCategoryClientProps, 'block'> & {
	gap: GapBlock
	categories: BlogCategoryCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading) {
		return (
			<div className={cx(styles.listing, gapVars(gap)?.classNameWrapper)}>
				<SkeletonItems
					gap={gap}
					loading={loading}
					total={block.column || 6}
				/>
			</div>
		)
	}

	if (categories.length) {
		return (
			<div className={cx(styles.listing, gapVars(gap)?.classNameWrapper)}>
				{categories.map((post, index) => (
					<FadeDiv
						key={`${compId}-post-${index}`}
						className={gapVars(gap)?.classNameInner}
					>
						<BlogCategoryCard data={post} />
					</FadeDiv>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	gap,
	prevPostCategorys,
	categories,
	loading,
}: {
	column: number
	gap: GapBlock
	prevPostCategorys: BlogCategoryCardProps['data'][]
	categories: BlogCategoryCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || categories.length || prevPostCategorys.length) {
		return (
			<div className={cx(styles.listing, gapVars(gap)?.classNameWrapper)}>
				{prevPostCategorys.map((post) => (
					<div
						key={`${compId}-prevpost-${post.id}`}
						className={gapVars(gap)?.classNameInner}
					>
						<BlogCategoryCard data={post} />
					</div>
				))}
				{categories.map((post) => (
					<div
						key={`${compId}-post-${post.id}`}
						className={gapVars(gap)?.classNameInner}
					>
						<BlogCategoryCard data={post} />
					</div>
				))}
				<SkeletonItems
					gap={gap}
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
	gap,
	prevPostCategorys,
	categories,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	gap: GapBlock
	prevPostCategorys: BlogCategoryCardProps['data'][]
	categories: BlogCategoryCardProps['data'][]
	loading?: boolean
	pagination: ResultPostCategories<Omit<BlogCategoryCardProps['data'], 'totalPost'>>
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevPostCategorys.length + categories.length}
				hasMore={pagination?.hasNextPage || false}
				className={cx(styles.listing, gapVars(gap)?.classNameWrapper)}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevPostCategorys.map((post) => (
					<div
						key={`${compId}-prevpost-${post.id}`}
						className={gapVars(gap)?.classNameInner}
					>
						<BlogCategoryCard data={post} />
					</div>
				))}
				{categories.map((post) => (
					<div
						key={`${compId}-post-${post.id}`}
						className={gapVars(gap)?.classNameInner}
					>
						<BlogCategoryCard data={post} />
					</div>
				))}
			</InfiniteScroll>

			{pagination?.hasNextPage || loading ? (
				<Stack
					gap={gap?.base || undefined}
					mt={{
						base: '24px',
						md: gap?.vertical || undefined,
					}}
				>
					<div className={cx(styles.listing, gapVars(gap)?.classNameWrapper)}>
						<SkeletonItems
							gap={gap}
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

function SkeletonItems({
	gap,
	loading,
	total,
}: {
	gap: GapBlock
	loading?: boolean
	total?: number
}) {
	const compId = useId()

	if (!loading) {
		return null
	}

	return Array.from({
		length: total || 6,
	}).map((_, index) => (
		<div
			key={`${compId}-${index}`}
			className={gapVars(gap)?.classNameInner}
		>
			<SkeletonBlogCard />
		</div>
	))
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingPostCategoryClientProps, 'block'> & {
	data: ResultPostCategories<Omit<BlogCategoryCardProps['data'], 'totalPost'>>
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
