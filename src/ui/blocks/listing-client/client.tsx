'use client'
import {
	Button,
	Center,
	Group,
	Loader,
	Pagination,
	Skeleton,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
} from '@mantine/core'
import { Search } from 'lucide-react'
import type { PaginatedDocs } from 'payload'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { ClientCard, SkeletonClientCard, type ClientCardProps } from '$layouts/Client'
import { slugify } from '$utils/common'
import {
	queryListingClient,
	type ListingClientProps,
	type OptionsQueryListingClients,
} from './server'

import styles from '$styles/blocks/listing-client.module.css'

export type ListingClientClientProps = ListingClientProps & {
	initialResult: PaginatedDocs<ClientCardProps['data']> | null
}

export default function ListingClientClient({
	block,
	initialResult,
	queried,
	withContainer,
	...props
}: ListingClientClientProps) {
	if (!withContainer) {
		return (
			<ListingClientInner
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
			data-slot="listing-client"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingClientInner
						block={block}
						initialResult={initialResult}
						queried={queried}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingClientInner({
	block,
	initialResult,
	queried,
	...props
}: Omit<ListingClientClientProps, 'withContainer'>) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingClients | null>(null)
	const [prevClients, setPrevClients] = useState<ClientCardProps['data'][]>([])
	const [resultClients, setResultClients] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 1
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '28px',
			vertical: block.gap?.vertical || block.gap?.base || '28px',
		}
	}, [block.gap])

	const clients = useMemo(() => {
		if (!resultClients) {
			return []
		}

		return resultClients?.docs
	}, [resultClients])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultClients) {
			return null
		}

		return resultClients
	}, [block, resultClients])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevClients = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevClients([...prevClients, ...clients])
			} else {
				setPrevClients([])
			}
		},
		[isCountinuePagination, prevClients, clients],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevClients(false)

			if (value) {
				setQueryParams({
					...queryParams,
					page: 1,
					search: value,
				})
			} else {
				setQueryParams({
					...queryParams,
					page: 1,
					search: undefined,
				})
			}
		},
		[handlerPrevClients, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevClients()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevClients, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setResultClients(null)

			startTransition(async () => {
				const resultClient = await queryListingClient(block, {
					...queryParams,
					queried,
				})

				setResultClients(resultClient)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-client-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			<FilterListing
				data={queryParams}
				block={block}
				onSearch={handlerSearch}
			/>

			{!clients.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Klien2M tidak ditemukan
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevClients={prevClients}
					clients={clients}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					clients={clients}
					prevClients={prevClients}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					block={block}
					clients={clients}
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
	clients,
	loading,
}: Pick<ListingClientClientProps, 'block'> & {
	clients: ClientCardProps['data'][]
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

	if (clients.length) {
		return (
			<div className={styles.listing}>
				{clients.map((client, index) => (
					<ClientCard
						data={client}
						key={`${compId}-client-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevClients,
	clients,
	loading,
}: {
	column: number
	prevClients: ClientCardProps['data'][]
	clients: ClientCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || clients.length || prevClients.length) {
		return (
			<div className={styles.listing}>
				{prevClients.map((client, index) => (
					<ClientCard
						key={`${compId}-prevclient-${index}`}
						data={client}
					/>
				))}
				{clients.map((client, index) => (
					<ClientCard
						data={client}
						key={`${compId}-client-${index}`}
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
	prevClients,
	clients,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevClients: ClientCardProps['data'][]
	clients: ClientCardProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<ClientCardProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevClients.length + clients.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevClients.map((client, index) => (
					<ClientCard
						key={`${compId}-prevclient-${index}`}
						data={client}
					/>
				))}
				{clients.map((client, index) => (
					<ClientCard
						data={client}
						key={`${compId}-client-${index}`}
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
	}).map((_, index) => <SkeletonClientCard key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	onSearch,
}: Pick<ListingClientClientProps, 'block'> & {
	data: OptionsQueryListingClients | null
	onSearch: (value: string) => void
}) {
	if (!block.showFilter) {
		return null
	}

	return (
		<Group
			justify="flex-end"
			className={styles.filter}
		>
			<TextInput
				type="search"
				placeholder="Cari klien..."
				className={styles.search}
				rightSection={
					<ThemeIcon
						variant="light"
						className="pointer-events-none"
					>
						<Search size={14} />
					</ThemeIcon>
				}
				rightSectionProps={{
					className: 'cursor-pointer',
					onClick: (e) => {
						const value = (e.target as HTMLDivElement).parentNode?.querySelector(
							'input',
						)?.value

						if (value) {
							onSearch(value)
						}
					},
				}}
				onBlur={(e) => {
					if ('value' in e.target && !e.target.value) {
						onSearch(e.target.value)
					}
				}}
				onKeyUp={(e) => {
					if (
						e.key === 'Enter' &&
						'value' in e.target &&
						typeof e.target.value === 'string'
					) {
						onSearch(e.target.value)
					}
				}}
			/>
		</Group>
	)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingClientClientProps, 'block'> & {
	data: PaginatedDocs<ClientCardProps['data']> | null
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
