'use client'
import {
	Accordion,
	AccordionControl,
	AccordionItem,
	AccordionPanel,
	Button,
	Center,
	Loader,
	MultiSelect,
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
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import { faqTypes } from '$payload-libs/enum'
import type { Faq } from '$payload-types'
import { slugify } from '$utils/common'
import { gapVars } from '$utils/styles'
import { queryListingFaq, type ListingFaqProps, type OptionsQueryListingFaqs } from './server'

import styles from '$styles/blocks/listing-faq.module.css'

export type ListingFaqClientProps = ListingFaqProps & {
	initialResult: PaginatedDocs<AccordionFaqProps['data']> | null
}

export default function ListingFaqClient({
	block,
	initialResult,
	withContainer,
	...props
}: ListingFaqClientProps) {
	if (!withContainer) {
		return (
			<ListingFaqInner
				{...props}
				block={block}
				initialResult={initialResult}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-faq"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingFaqInner
						block={block}
						initialResult={initialResult}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingFaqInner({
	block,
	initialResult,
	...props
}: Omit<ListingFaqClientProps, 'withContainer'>) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingFaqs | null>(null)
	const [prevFaqs, setPrevFaqs] = useState<AccordionFaqProps['data'][]>([])
	const [resultFaqs, setResultFaqs] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 1
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '12px',
			vertical: block.gap?.vertical || block.gap?.base || '12px',
		}
	}, [block.gap])

	const faqs = useMemo(() => {
		if (!resultFaqs) {
			return []
		}

		return resultFaqs?.docs
	}, [resultFaqs])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultFaqs) {
			return null
		}

		return resultFaqs
	}, [block, resultFaqs])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevFaqs = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevFaqs([...prevFaqs, ...faqs])
			} else {
				setPrevFaqs([])
			}
		},
		[isCountinuePagination, prevFaqs, faqs],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevFaqs(false)

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
		[handlerPrevFaqs, queryParams],
	)

	const handlerType = useCallback(
		(value?: NonNullable<Faq['type']> | null) => {
			handlerPrevFaqs(false)

			const types: NonNullable<Faq['type']> = []

			value?.forEach((item) => {
				types.push(item)
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					types,
				},
			})
		},
		[handlerPrevFaqs, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevFaqs()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevFaqs, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setResultFaqs(null)

			startTransition(async () => {
				const resultFaq = await queryListingFaq(block, queryParams)

				setResultFaqs(resultFaq)
			})
		}
	}, [queryParams, block])

	return (
		<div
			{...props}
			data-slot="listing-faq-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
			className={styles.wrapper}
		>
			<FilterListing
				data={queryParams}
				block={block}
				className={styles.filter}
				onChangeType={handlerType}
				onSearch={handlerSearch}
			/>

			<div className={styles.listing}>
				{!faqs.length && !isLoading ? (
					<Text
						c="dimmed"
						ta="center"
					>
						FAQ tidak ditemukan
					</Text>
				) : null}

				<Accordion
					variant="contained"
					chevronSize={20}
					radius="lg"
					className={gapVars(gap)?.className}
				>
					{block.pagination === 'infinite-scroll' ? (
						<ListingInfiniteScroll
							column={column}
							prevFaqs={prevFaqs}
							faqs={faqs}
							loading={isLoading}
							pagination={pagination}
							onPaging={handlerPagination}
						/>
					) : block.pagination === 'load-more' ? (
						<ListingLoadMore
							column={column}
							faqs={faqs}
							prevFaqs={prevFaqs}
							loading={isLoading}
						/>
					) : (
						<ListingDefault
							block={block}
							faqs={faqs}
							loading={isLoading}
						/>
					)}
				</Accordion>

				<PaginationListing
					block={block}
					data={pagination}
					loading={isLoading}
					onPaging={handlerPagination}
					className="mt-10"
				/>
			</div>

			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}

function ListingDefault({
	block,
	faqs,
	loading,
}: Pick<ListingFaqClientProps, 'block'> & {
	faqs: AccordionFaqProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading) {
		return (
			<SkeletonItems
				loading={loading}
				total={block.column || 6}
			/>
		)
	}

	if (faqs.length) {
		return faqs.map((faq, index) => (
			<AccordionFaq
				key={`${compId}-faq-${index}`}
				data={faq}
				value={`${compId}-faq-${index}`}
			/>
		))
	}

	return null
}

function ListingLoadMore({
	column,
	prevFaqs,
	faqs,
	loading,
}: {
	column: number
	prevFaqs: AccordionFaqProps['data'][]
	faqs: AccordionFaqProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || faqs.length || prevFaqs.length) {
		return (
			<>
				{prevFaqs.map((faq, index) => (
					<AccordionFaq
						key={`${compId}-prevfaq-${index}`}
						data={faq}
						value={`${compId}-prevfaq-${index}`}
					/>
				))}
				{faqs.map((faq, index) => (
					<AccordionFaq
						data={faq}
						key={`${compId}-faq-${index}`}
						value={`${compId}-faq-${index}`}
					/>
				))}
				<SkeletonItems
					loading={loading}
					total={column}
				/>
			</>
		)
	}

	return null
}

function ListingInfiniteScroll({
	column,
	prevFaqs,
	faqs,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevFaqs: AccordionFaqProps['data'][]
	faqs: AccordionFaqProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<AccordionFaqProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevFaqs.length + faqs.length}
				hasMore={pagination?.hasNextPage || false}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevFaqs.map((faq, index) => (
					<AccordionFaq
						key={`${compId}-prevfaq-${index}`}
						data={faq}
						value={`${compId}-prevfaq-${index}`}
					/>
				))}
				{faqs.map((faq, index) => (
					<AccordionFaq
						data={faq}
						key={`${compId}-faq-${index}`}
						value={`${compId}-faq-${index}`}
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
					<SkeletonItems
						loading={loading}
						total={column}
					/>
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
	}).map((_, index) => (
		<Skeleton
			h={52}
			className="not-first:mt-1"
			key={`${compId}-${index}`}
		/>
	))
}

type AccordionFaqProps = {
	data: Pick<Faq, 'title' | 'message'>
	value: string
}

function AccordionFaq({ data, value }: AccordionFaqProps) {
	return (
		<AccordionItem value={value}>
			<AccordionControl>{data.title}</AccordionControl>
			<AccordionPanel>
				<Richtext data={data.message} />
			</AccordionPanel>
		</AccordionItem>
	)
}

function FilterListing({
	data,
	block,
	className,
	onChangeType,
	onSearch,
}: Pick<ListingFaqClientProps, 'block'> & {
	data: OptionsQueryListingFaqs | null
	onSearch: (value: string) => void
	onChangeType: (value?: NonNullable<Faq['type']> | null) => void
	className?: string
}) {
	const defaultCategories = useMemo(() => {
		const types: NonNullable<Faq['type']> = []

		if (block.type === 'selectedTypes' && block.selectedTypes && block.selectedTypes.length) {
			block.selectedTypes.forEach((faqType) => {
				types.push(faqType)
			})
		}

		return types
	}, [block])

	const filterTypes = useMemo(() => {
		if (data?.filter?.types) {
			const types: NonNullable<Faq['type']> = []

			data.filter.types.forEach((faqType) => {
				types.push(faqType)
			})

			return types
		}

		return null
	}, [data])

	if (!block.showFilter) {
		return null
	}

	return (
		<Stack className={className}>
			<TextInput
				type="search"
				placeholder="Cari faq..."
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
			<MultiSelect
				data={faqTypes}
				value={filterTypes ? filterTypes : undefined}
				defaultValue={defaultCategories}
				clearable
				placeholder="Pilih tipe"
				comboboxProps={{
					withinPortal: false,
					position: 'bottom-end',
				}}
				onChange={(values) => onChangeType(values as NonNullable<Faq['type']>)}
				onClear={onChangeType}
			/>
		</Stack>
	)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingFaqClientProps, 'block'> & {
	data: PaginatedDocs<AccordionFaqProps['data']> | null
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
