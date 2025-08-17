'use client'
import { Button, Center, Loader, Pagination, Skeleton, Stack, Text } from '@mantine/core'
import type { PaginatedDocs } from 'payload'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { ServiceGrid, SkeletonServiceGrid, type ServiceGridProps } from '$layouts/Service'
import { slugify } from '$utils/common'
import {
	queryListingService,
	type ListingServiceProps,
	type OptionsQueryListingServices,
} from './server'

import styles from '$styles/blocks/listing-service.module.css'

export type ListingServiceClientProps = ListingServiceProps & {
	initialResult: PaginatedDocs<ServiceGridProps['data']> | null
}

export default function ListingServiceClient({
	block,
	initialResult,
	queried,
	withContainer,
	...props
}: ListingServiceClientProps) {
	if (!withContainer) {
		return (
			<ListingServiceInner
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
			data-slot="listing-service"
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingServiceInner
						block={block}
						initialResult={initialResult}
						queried={queried}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

export function ListingServiceInner({
	block,
	initialResult,
	queried,
	...props
}: Omit<ListingServiceClientProps, 'withContainer'>) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingServices | null>(null)
	const [prevServices, setPrevServices] = useState<ServiceGridProps['data'][]>([])
	const [resultServices, setResultServices] = useState(initialResult)
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
		if (!resultServices) {
			return []
		}

		return resultServices?.docs
	}, [resultServices])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultServices) {
			return null
		}

		return resultServices
	}, [block, resultServices])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevServices = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevServices([...prevServices, ...posts])
			} else {
				setPrevServices([])
			}
		},
		[isCountinuePagination, prevServices, posts],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevServices()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevServices, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultServices(null)

			startTransition(async () => {
				const resultService = await queryListingService(block, {
					...queryParams,
					queried,
				})

				setResultServices(resultService)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-service-inner"
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
					prevServices={prevServices}
					posts={posts}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					posts={posts}
					prevServices={prevServices}
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
}: Pick<ListingServiceClientProps, 'block'> & {
	posts: ServiceGridProps['data'][]
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
					<ServiceGrid
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
	prevServices,
	posts,
	loading,
}: {
	column: number
	prevServices: ServiceGridProps['data'][]
	posts: ServiceGridProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || posts.length || prevServices.length) {
		return (
			<div className={styles.listing}>
				{prevServices.map((post, index) => (
					<ServiceGrid
						key={`${compId}-prevpost-${index}`}
						data={post}
					/>
				))}
				{posts.map((post, index) => (
					<ServiceGrid
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
	prevServices,
	posts,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevServices: ServiceGridProps['data'][]
	posts: ServiceGridProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<ServiceGridProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevServices.length + posts.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevServices.map((post, index) => (
					<ServiceGrid
						key={`${compId}-prevpost-${index}`}
						data={post}
					/>
				))}
				{posts.map((post, index) => (
					<ServiceGrid
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
	}).map((_, index) => <SkeletonServiceGrid key={`${compId}-${index}`} />)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingServiceClientProps, 'block'> & {
	data: PaginatedDocs<ServiceGridProps['data']> | null
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
