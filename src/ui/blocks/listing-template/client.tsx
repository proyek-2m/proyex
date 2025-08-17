'use client'
import {
	ActionIcon,
	Button,
	Center,
	Group,
	Loader,
	MultiSelect,
	Pagination,
	Popover,
	PopoverDropdown,
	PopoverTarget,
	Skeleton,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	type OptionsData,
} from '@mantine/core'
import { Filter, Search } from 'lucide-react'
import type { PaginatedDocs } from 'payload'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { SkeletonTemplateTile, TemplateTile, type TemplateTileProps } from '$layouts/Template'
import type { Service } from '$payload-types'
import { slugify } from '$utils/common'
import {
	queryListingTemplate,
	type ListingTemplateProps,
	type OptionsQueryListingTemplates,
} from './server'

import styles from '$styles/blocks/listing-template.module.css'

export type ListingTemplateClientProps = ListingTemplateProps & {
	initialResult: PaginatedDocs<TemplateTileProps['data']> | null
	services: PaginatedDocs<Pick<Service, 'id' | 'title'>> | null
}

export default function ListingTemplateClient({
	block,
	initialResult,
	queried,
	services,
	withContainer,
	...props
}: ListingTemplateClientProps) {
	if (!withContainer) {
		return (
			<ListingTemplateInner
				{...props}
				block={block}
				initialResult={initialResult}
				queried={queried}
				services={services}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-template"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingTemplateInner
						block={block}
						initialResult={initialResult}
						queried={queried}
						services={services}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingTemplateInner({
	block,
	initialResult,
	queried,
	services,
	...props
}: ListingTemplateClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingTemplates | null>(null)
	const [prevTemplates, setPrevTemplates] = useState<TemplateTileProps['data'][]>([])
	const [resultTemplates, setResultTemplates] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 2
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '40px',
			vertical: block.gap?.vertical || block.gap?.base || '40px',
		}
	}, [block.gap])

	const templates = useMemo(() => {
		if (!resultTemplates) {
			return []
		}

		return resultTemplates?.docs
	}, [resultTemplates])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultTemplates) {
			return null
		}

		return resultTemplates
	}, [block, resultTemplates])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevTemplates = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevTemplates([...prevTemplates, ...templates])
			} else {
				setPrevTemplates([])
			}
		},
		[isCountinuePagination, prevTemplates, templates],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevTemplates(false)

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
		[handlerPrevTemplates, queryParams],
	)

	const handlerService = useCallback(
		(value?: string[] | null) => {
			handlerPrevTemplates(false)

			const serviceIds: number[] = []

			value?.forEach((item) => {
				serviceIds.push(Number(item))
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					serviceIds,
				},
			})
		},
		[handlerPrevTemplates, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevTemplates()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevTemplates, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultTemplates(null)

			startTransition(async () => {
				const resultTemplate = await queryListingTemplate(block, {
					...queryParams,
					queried,
				})

				setResultTemplates(resultTemplate)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-template-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			<FilterListing
				data={queryParams}
				block={block}
				services={services}
				onChangeService={handlerService}
				onSearch={handlerSearch}
			/>

			{!templates.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Template tidak ditemukan
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevTemplates={prevTemplates}
					templates={templates}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					templates={templates}
					prevTemplates={prevTemplates}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					block={block}
					templates={templates}
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
	templates,
	loading,
}: Pick<ListingTemplateClientProps, 'block'> & {
	templates: TemplateTileProps['data'][]
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

	if (templates.length) {
		return (
			<div className={styles.listing}>
				{templates.map((template, index) => (
					<TemplateTile
						data={template}
						key={`${compId}-template-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevTemplates,
	templates,
	loading,
}: {
	column: number
	prevTemplates: TemplateTileProps['data'][]
	templates: TemplateTileProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || templates.length || prevTemplates.length) {
		return (
			<div className={styles.listing}>
				{prevTemplates.map((template, index) => (
					<TemplateTile
						key={`${compId}-prevtemplate-${index}`}
						data={template}
					/>
				))}
				{templates.map((template, index) => (
					<TemplateTile
						data={template}
						key={`${compId}-template-${index}`}
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
	prevTemplates,
	templates,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevTemplates: TemplateTileProps['data'][]
	templates: TemplateTileProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<TemplateTileProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevTemplates.length + templates.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevTemplates.map((template, index) => (
					<TemplateTile
						key={`${compId}-prevtemplate-${index}`}
						data={template}
					/>
				))}
				{templates.map((template, index) => (
					<TemplateTile
						data={template}
						key={`${compId}-template-${index}`}
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
	}).map((_, index) => <SkeletonTemplateTile key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	services,
	onChangeService,
	onSearch,
}: Pick<ListingTemplateClientProps, 'block' | 'services'> & {
	data: OptionsQueryListingTemplates | null
	onSearch: (value: string) => void
	onChangeService: (value?: string[] | null) => void
}) {
	const optionServices = useMemo(() => {
		if (!services || !services.docs || !services.docs.length) {
			return []
		}

		const options: OptionsData = []

		services.docs.forEach((service) => {
			if (service.title) {
				options.push({
					value: String(service.id),
					label: service.title,
				})
			}
		})

		return options
	}, [services])

	const defaultServices = useMemo(() => {
		const serviceIds: string[] = []

		if (
			block.type === 'selectedServices' &&
			block.selectedServices &&
			block.selectedServices.length
		) {
			block.selectedServices.forEach((service) => {
				if (typeof service === 'object') {
					serviceIds.push(String(service.id))
				} else {
					serviceIds.push(String(service))
				}
			})
		}

		return serviceIds
	}, [block])

	const filterServices = useMemo(() => {
		if (data?.filter?.serviceIds) {
			const serviceIds: string[] = []

			data.filter.serviceIds.forEach((service) => {
				serviceIds.push(String(service))
			})

			return serviceIds
		}

		return null
	}, [data])

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
				placeholder="Cari template..."
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
			<Popover position="bottom-end">
				<PopoverTarget>
					<ActionIcon
						variant="light"
						className={styles.cta_toggle}
					>
						<Filter />
					</ActionIcon>
				</PopoverTarget>
				<PopoverDropdown>
					<Stack
						gap="xs"
						w={{
							base: 'calc(100vw - 62px)',
							md: 280,
						}}
					>
						<MultiSelect
							data={optionServices}
							value={filterServices ? filterServices : undefined}
							defaultValue={defaultServices}
							clearable
							placeholder={
								!services || !services.docs.length
									? 'Layanan kosong'
									: 'Pilih layanan'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!services || !services.docs.length}
							onChange={onChangeService}
							onClear={onChangeService}
						/>
					</Stack>
				</PopoverDropdown>
			</Popover>
		</Group>
	)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingTemplateClientProps, 'block'> & {
	data: PaginatedDocs<TemplateTileProps['data']> | null
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
