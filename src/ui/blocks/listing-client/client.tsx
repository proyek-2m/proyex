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
import { ClientCard, SkeletonClientCard, type ClientCardProps } from '$layouts/Client'
import type { Team, Template } from '$payload-types'
import { slugify } from '$utils/common'
import {
	queryListingClient,
	type ListingClientProps,
	type OptionsQueryListingClients,
} from './server'

import styles from '$styles/blocks/listing-client.module.css'

export type ListingClientClientProps = ListingClientProps & {
	initialResult: PaginatedDocs<ClientCardProps['data']> | null
	templates: PaginatedDocs<Pick<Template, 'id' | 'title'>> | null
	teams: PaginatedDocs<Pick<Team, 'id' | 'title'>> | null
}

export default function ListingClientClient({
	block,
	initialResult,
	queried,
	templates,
	teams,
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
				templates={templates}
				teams={teams}
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
						templates={templates}
						teams={teams}
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
	templates,
	teams,
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

	const handlerTemplate = useCallback(
		(value?: string[] | null) => {
			handlerPrevClients(false)

			const templateIds: number[] = []

			value?.forEach((item) => {
				templateIds.push(Number(item))
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					templateIds,
				},
			})
		},
		[handlerPrevClients, queryParams],
	)

	const handlerTeam = useCallback(
		(value?: string[] | null) => {
			handlerPrevClients(false)

			const teamIds: number[] = []

			value?.forEach((item) => {
				teamIds.push(Number(item))
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					teamIds,
				},
			})
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
				templates={templates}
				teams={teams}
				onChangeTemplate={handlerTemplate}
				onChangeTeam={handlerTeam}
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
	templates,
	teams,
	onChangeTemplate,
	onChangeTeam,
	onSearch,
}: Pick<ListingClientClientProps, 'block' | 'templates' | 'teams'> & {
	data: OptionsQueryListingClients | null
	onSearch: (value: string) => void
	onChangeTemplate: (value?: string[] | null) => void
	onChangeTeam: (value?: string[] | null) => void
}) {
	const optionTemplates = useMemo(() => {
		if (!templates || !templates.docs || !templates.docs.length) {
			return []
		}

		const options: OptionsData = []

		templates.docs.forEach((template) => {
			if (template.title) {
				options.push({
					value: String(template.id),
					label: template.title,
				})
			}
		})

		return options
	}, [templates])

	const defaultTemplates = useMemo(() => {
		const templateIds: string[] = []

		if (
			block.type === 'selectedTemplates' &&
			block.selectedTemplates &&
			block.selectedTemplates.length
		) {
			block.selectedTemplates.forEach((template) => {
				if (typeof template === 'object') {
					templateIds.push(String(template.id))
				} else {
					templateIds.push(String(template))
				}
			})
		}

		return templateIds
	}, [block])

	const filterTemplates = useMemo(() => {
		if (data?.filter?.templateIds) {
			const templateIds: string[] = []

			data.filter.templateIds.forEach((template) => {
				templateIds.push(String(template))
			})

			return templateIds
		}

		return null
	}, [data])

	const optionTeams = useMemo(() => {
		if (!teams || !teams.docs || !teams.docs.length) {
			return []
		}

		const options: OptionsData = []

		teams.docs.forEach((team) => {
			if (team.title) {
				options.push({
					value: String(team.id),
					label: team.title,
				})
			}
		})

		return options
	}, [teams])

	const defaultTeams = useMemo(() => {
		const teamIds: string[] = []

		if (block.type === 'selectedTeams' && block.selectedTeams && block.selectedTeams.length) {
			block.selectedTeams.forEach((team) => {
				if (typeof team === 'object') {
					teamIds.push(String(team.id))
				} else {
					teamIds.push(String(team))
				}
			})
		}

		return teamIds
	}, [block])

	const filterTeams = useMemo(() => {
		if (data?.filter?.teamIds) {
			const teamIds: string[] = []

			data.filter.teamIds.forEach((template) => {
				teamIds.push(String(template))
			})

			return teamIds
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
							data={optionTemplates}
							value={filterTemplates ? filterTemplates : undefined}
							defaultValue={defaultTemplates}
							clearable
							placeholder={
								!templates || !templates.docs.length
									? 'Template kosong'
									: 'Pilih template'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!templates || !templates.docs.length}
							onChange={onChangeTemplate}
							onClear={onChangeTemplate}
						/>
						<MultiSelect
							data={optionTeams}
							value={filterTeams ? filterTeams : undefined}
							defaultValue={defaultTeams}
							clearable
							placeholder={
								!teams || !teams.docs.length ? 'Team kosong' : 'Pilih warga'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!teams || !teams.docs.length}
							onChange={onChangeTeam}
							onClear={onChangeTeam}
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
