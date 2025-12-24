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
import { BlogCard, SkeletonBlogCard, type BlogCardProps } from '$layouts/Blog'
import type { PostCategory, Team } from '$payload-types'
import { slugify } from '$utils/common'
import { queryListingPost, type ListingPostProps, type OptionsQueryListingPosts } from './server'

import styles from '$styles/blocks/listing-post.module.css'

export type ListingPostClientProps = ListingPostProps & {
	initialResult: PaginatedDocs<BlogCardProps['data']> | null
	categories: PaginatedDocs<Pick<PostCategory, 'id' | 'title'>> | null
	authors: PaginatedDocs<Pick<Team, 'id' | 'title'>> | null
}

export default function ListingPostClient({
	block,
	initialResult,
	queried,
	categories,
	authors,
	withContainer,
	...props
}: ListingPostClientProps) {
	if (!withContainer) {
		return (
			<ListingPostInner
				{...props}
				block={block}
				initialResult={initialResult}
				queried={queried}
				categories={categories}
				authors={authors}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-post"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingPostInner
						block={block}
						initialResult={initialResult}
						queried={queried}
						categories={categories}
						authors={authors}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingPostInner({
	block,
	initialResult,
	queried,
	categories,
	authors,
	...props
}: ListingPostClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingPosts | null>(null)
	const [prevPosts, setPrevPosts] = useState<BlogCardProps['data'][]>([])
	const [resultPosts, setResultPosts] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 3
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '28px',
			vertical: block.gap?.vertical || block.gap?.base || '28px',
		}
	}, [block.gap])

	const posts = useMemo(() => {
		if (!resultPosts) {
			return []
		}

		return resultPosts?.docs
	}, [resultPosts])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultPosts) {
			return null
		}

		return resultPosts
	}, [block, resultPosts])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevPosts = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevPosts([...prevPosts, ...posts])
			} else {
				setPrevPosts([])
			}
		},
		[isCountinuePagination, prevPosts, posts],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevPosts(false)

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
		[handlerPrevPosts, queryParams],
	)

	const handlerCategory = useCallback(
		(value?: string[] | null) => {
			handlerPrevPosts(false)

			const categoryIds: number[] = []

			value?.forEach((item) => {
				categoryIds.push(Number(item))
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					categoryIds,
				},
			})
		},
		[handlerPrevPosts, queryParams],
	)

	const handlerAuthor = useCallback(
		(value?: string[] | null) => {
			const authorIds: number[] = []

			value?.forEach((item) => {
				authorIds.push(Number(item))
			})

			handlerPrevPosts(false)

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					teamIds: authorIds,
				},
			})
		},
		[handlerPrevPosts, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevPosts()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevPosts, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setResultPosts(null)

			startTransition(async () => {
				const resultPost = await queryListingPost(block, {
					...queryParams,
					queried,
				})

				setResultPosts(resultPost)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-post-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			<FilterListing
				data={queryParams}
				block={block}
				categories={categories}
				authors={authors}
				onChangeCategory={handlerCategory}
				onChangeAuthor={handlerAuthor}
				onSearch={handlerSearch}
			/>

			{!posts.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Blog tidak ditemukan.
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevPosts={prevPosts}
					posts={posts}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					posts={posts}
					prevPosts={prevPosts}
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
}: Pick<ListingPostClientProps, 'block'> & {
	posts: BlogCardProps['data'][]
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
					<BlogCard
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
	prevPosts,
	posts,
	loading,
}: {
	column: number
	prevPosts: BlogCardProps['data'][]
	posts: BlogCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || posts.length || prevPosts.length) {
		return (
			<div className={styles.listing}>
				{prevPosts.map((post, index) => (
					<BlogCard
						key={`${compId}-prevpost-${index}`}
						data={post}
					/>
				))}
				{posts.map((post, index) => (
					<BlogCard
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
	prevPosts,
	posts,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevPosts: BlogCardProps['data'][]
	posts: BlogCardProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<BlogCardProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevPosts.length + posts.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevPosts.map((post, index) => (
					<BlogCard
						key={`${compId}-prevpost-${index}`}
						data={post}
					/>
				))}
				{posts.map((post, index) => (
					<BlogCard
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
	}).map((_, index) => <SkeletonBlogCard key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	categories,
	authors,
	onChangeCategory,
	onChangeAuthor,
	onSearch,
}: Pick<ListingPostClientProps, 'block' | 'categories' | 'authors'> & {
	data: OptionsQueryListingPosts | null
	onSearch: (value: string) => void
	onChangeCategory: (value?: string[] | null) => void
	onChangeAuthor: (value?: string[] | null) => void
}) {
	const optionCategories = useMemo(() => {
		if (!categories || !categories.docs || !categories.docs.length) {
			return []
		}

		const options: OptionsData = []

		categories.docs.forEach((category) => {
			if (category.title) {
				options.push({
					value: String(category.id),
					label: category.title,
				})
			}
		})

		return options
	}, [categories])

	const optionAuthors = useMemo(() => {
		if (!authors || !authors.docs || !authors.docs.length) {
			return []
		}

		const options: OptionsData = []

		authors.docs.forEach((author) => {
			if (author.title) {
				options.push({
					value: String(author.id),
					label: author.title,
				})
			}
		})

		return options
	}, [authors])

	const defaultCategories = useMemo(() => {
		const categoryIds: string[] = []

		if (
			block.type === 'selectedCategories' &&
			block.selectedCategories &&
			block.selectedCategories.length
		) {
			block.selectedCategories.forEach((category) => {
				if (typeof category === 'object') {
					categoryIds.push(String(category.id))
				} else {
					categoryIds.push(String(category))
				}
			})
		}

		return categoryIds
	}, [block])

	const filterCategories = useMemo(() => {
		if (data?.filter?.categoryIds) {
			const categoryIds: string[] = []

			data.filter.categoryIds.forEach((category) => {
				categoryIds.push(String(category))
			})

			return categoryIds
		}

		return null
	}, [data])

	const defaultAuthors = useMemo(() => {
		const authorIds: string[] = []

		if (block.type === 'createdBy' && block.createdBy && block.createdBy.length) {
			block.createdBy.forEach((author) => {
				if (typeof author === 'object') {
					authorIds.push(String(author.id))
				} else {
					authorIds.push(String(author))
				}
			})
		}

		return authorIds
	}, [block])

	const filterAuthors = useMemo(() => {
		if (data?.filter?.teamIds) {
			const authorIds: string[] = []

			data.filter.teamIds.forEach((author) => {
				authorIds.push(String(author))
			})

			return authorIds
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
				placeholder="Cari blog..."
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
							data={optionCategories}
							value={filterCategories ? filterCategories : undefined}
							defaultValue={defaultCategories}
							clearable
							placeholder={
								!categories || !categories.docs.length
									? 'Category kosong'
									: 'Pilih category'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!categories || !categories.docs.length}
							onChange={onChangeCategory}
							onClear={onChangeCategory}
						/>
						<MultiSelect
							placeholder={
								!authors || !authors.docs.length
									? 'Warga2M kosong'
									: 'Pilih warga2m'
							}
							data={optionAuthors}
							value={filterAuthors ? filterAuthors : undefined}
							defaultValue={defaultAuthors}
							searchable
							clearable
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!authors || !authors.docs.length}
							onChange={onChangeAuthor}
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
}: Pick<ListingPostClientProps, 'block'> & {
	data: PaginatedDocs<BlogCardProps['data']> | null
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
