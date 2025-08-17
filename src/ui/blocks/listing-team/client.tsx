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
	Select,
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
import { SkeletonTeamGrid, TeamGrid, type TeamGridProps } from '$layouts/Team'
import { teamGender } from '$payload-libs/enum'
import type { Team, TeamPosition } from '$payload-types'
import { slugify } from '$utils/common'
import { queryListingTeam, type ListingTeamProps, type OptionsQueryListingTeams } from './server'

import styles from '$styles/blocks/listing-team.module.css'

export type ListingTeamClientProps = ListingTeamProps & {
	initialResult: PaginatedDocs<TeamGridProps['data']> | null
	positions: PaginatedDocs<Pick<TeamPosition, 'id' | 'title'>> | null
}

export default function ListingTeamClient({
	block,
	initialResult,
	queried,
	positions,
	withContainer,
	...props
}: ListingTeamClientProps) {
	if (!withContainer) {
		return (
			<ListingTeamInner
				{...props}
				block={block}
				initialResult={initialResult}
				queried={queried}
				positions={positions}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-team"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingTeamInner
						block={block}
						initialResult={initialResult}
						queried={queried}
						positions={positions}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingTeamInner({
	block,
	initialResult,
	queried,
	positions,
	...props
}: ListingTeamClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingTeams | null>(null)
	const [prevTeams, setPrevTeams] = useState<TeamGridProps['data'][]>([])
	const [resultTeams, setResultTeams] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 4
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '40px',
			vertical: block.gap?.vertical || block.gap?.base || '40px',
		}
	}, [block.gap])

	const teams = useMemo(() => {
		if (!resultTeams) {
			return []
		}

		return resultTeams?.docs
	}, [resultTeams])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultTeams) {
			return null
		}

		return resultTeams
	}, [block, resultTeams])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevTeams = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevTeams([...prevTeams, ...teams])
			} else {
				setPrevTeams([])
			}
		},
		[isCountinuePagination, prevTeams, teams],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevTeams(false)

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
		[handlerPrevTeams, queryParams],
	)

	const handlerPosition = useCallback(
		(value?: string[] | null) => {
			handlerPrevTeams(false)

			const positionIds: number[] = []

			value?.forEach((item) => {
				positionIds.push(Number(item))
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					positionIds,
				},
			})
		},
		[handlerPrevTeams, queryParams],
	)

	const handlerGender = useCallback(
		(value?: string | null) => {
			handlerPrevTeams(false)

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					gender: value as Team['gender'],
				},
			})
		},
		[handlerPrevTeams, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevTeams()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevTeams, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultTeams(null)

			startTransition(async () => {
				const resultTeam = await queryListingTeam(block, {
					...queryParams,
					queried,
				})

				setResultTeams(resultTeam)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-team-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			<FilterListing
				data={queryParams}
				block={block}
				positions={positions}
				onChangePosition={handlerPosition}
				onChangeGender={handlerGender}
				onSearch={handlerSearch}
			/>

			{!teams.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Warga2M tidak ditemukan
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevTeams={prevTeams}
					teams={teams}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					teams={teams}
					prevTeams={prevTeams}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					block={block}
					teams={teams}
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
	teams,
	loading,
}: Pick<ListingTeamClientProps, 'block'> & {
	teams: TeamGridProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading) {
		return (
			<div className={styles.listing}>
				<SkeletonItems
					loading={loading}
					total={block.column || 8}
				/>
			</div>
		)
	}

	if (teams.length) {
		return (
			<div className={styles.listing}>
				{teams.map((team, index) => (
					<TeamGrid
						data={team}
						key={`${compId}-team-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevTeams,
	teams,
	loading,
}: {
	column: number
	prevTeams: TeamGridProps['data'][]
	teams: TeamGridProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || teams.length || prevTeams.length) {
		return (
			<div className={styles.listing}>
				{prevTeams.map((team, index) => (
					<TeamGrid
						key={`${compId}-prevteam-${index}`}
						data={team}
					/>
				))}
				{teams.map((team, index) => (
					<TeamGrid
						data={team}
						key={`${compId}-team-${index}`}
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
	prevTeams,
	teams,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevTeams: TeamGridProps['data'][]
	teams: TeamGridProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<TeamGridProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevTeams.length + teams.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevTeams.map((team, index) => (
					<TeamGrid
						key={`${compId}-prevteam-${index}`}
						data={team}
					/>
				))}
				{teams.map((team, index) => (
					<TeamGrid
						data={team}
						key={`${compId}-team-${index}`}
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
	}).map((_, index) => <SkeletonTeamGrid key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	positions,
	onChangePosition,
	onChangeGender,
	onSearch,
}: Pick<ListingTeamClientProps, 'block' | 'positions'> & {
	data: OptionsQueryListingTeams | null
	onSearch: (value: string) => void
	onChangePosition: (value?: string[] | null) => void
	onChangeGender: (value?: string | null) => void
}) {
	const optionPositions = useMemo(() => {
		if (!positions || !positions.docs || !positions.docs.length) {
			return []
		}

		const options: OptionsData = []

		positions.docs.forEach((position) => {
			if (position.title) {
				options.push({
					value: String(position.id),
					label: position.title,
				})
			}
		})

		return options
	}, [positions])

	const defaultPositions = useMemo(() => {
		const positionIds: string[] = []

		if (
			block.type === 'selectedPositions' &&
			block.selectedPositions &&
			block.selectedPositions.length
		) {
			block.selectedPositions.forEach((position) => {
				if (typeof position === 'object') {
					positionIds.push(String(position.id))
				} else {
					positionIds.push(String(position))
				}
			})
		}

		return positionIds
	}, [block])

	const filterPositions = useMemo(() => {
		if (data?.filter?.positionIds) {
			const positionIds: string[] = []

			data.filter.positionIds.forEach((position) => {
				positionIds.push(String(position))
			})

			return positionIds
		}

		return null
	}, [data])

	const defaultGender = useMemo(() => {
		let gender: Team['gender'] = null

		if (block.type === 'selectedGender' && block.selectedGender) {
			gender = block.selectedGender
		}

		return gender
	}, [block])

	const filterGender = useMemo(() => {
		return data?.filter?.gender
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
				placeholder="Cari warga..."
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
							data={optionPositions}
							value={filterPositions ? filterPositions : undefined}
							defaultValue={defaultPositions}
							clearable
							placeholder={
								!positions || !positions.docs.length
									? 'Position kosong'
									: 'Pilih position'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!positions || !positions.docs.length}
							onChange={onChangePosition}
							onClear={onChangePosition}
						/>
						<Select
							data={teamGender}
							value={filterGender}
							defaultValue={defaultGender}
							clearable
							placeholder={
								!positions || !positions.docs.length
									? 'Jenis kelamin kosong'
									: 'Pilih jenis kelamin'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!positions || !positions.docs.length}
							onChange={onChangeGender}
							onClear={onChangeGender}
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
}: Pick<ListingTeamClientProps, 'block'> & {
	data: PaginatedDocs<TeamGridProps['data']> | null
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
