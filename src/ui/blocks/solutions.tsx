import { SimpleGrid, Stack } from '@mantine/core'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import Media from '$blocks/media'
import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import type { Actions as ActionsBlock, Solutions as SolutionsBlock } from '$payload-types'
import { slugify } from '$utils/common'
import { cx } from '$utils/styles'

import styles from '$styles/blocks/solutions.module.css'

export type SolutionsProps = {
	block: SolutionsBlock | Omit<SolutionsBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Solutions({ block, withContainer, ...props }: SolutionsProps) {
	if (!withContainer) {
		return (
			<SolutionsInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="solutions"
			id={block.blockName || props.id}
		>
			<SolutionsInner
				block={block}
				className="container"
			/>
		</section>
	)
}

function SolutionsInner({ block, ...props }: Omit<SolutionsProps, 'withContainer'>) {
	const compId = useId()

	const refId = useMemo(() => {
		return block.blockName || props.id || slugify(compId)
	}, [block, props, compId])

	const align = useMemo(() => {
		return block.align || 'left'
	}, [block.align])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '80px',
			vertical: block.gap?.vertical || '32px',
		}
	}, [block.gap])

	if (!block.items || block.items.length === 0) {
		return null
	}

	return (
		<FadeContainer className="w-full">
			<div
				{...props}
				id={refId}
				data-slot="solutions-inner"
				data-align={align}
				data-desktop-position={block.desktopPosition || 'content-media'}
				data-mobile-position={block.mobilePosition || 'media-content'}
				className={cx(styles.solutions, props.className)}
			>
				<PatternSolution />
				<Stack
					id={`${refId}-wrapper`}
					className={styles.grid}
				>
					{block.items.map((item, index) => {
						const actionItems: ActionsBlock['items'] = item?.actions?.map((action) => ({
							...action,
							variant: action.variant || 'light',
						}))

						return (
							<SimpleGrid
								key={`${refId}-${index}`}
								spacing={0}
								verticalSpacing={0}
								cols={{
									base: 1,
									md: 2,
								}}
							>
								<FadeDiv className={styles.content}>
									<BaseContent
										block={{
											...item.content,
											textColor: block.textColor,
											featuredTextColor: block.featuredTextColor,
											align,
										}}
									/>

									{actionItems && actionItems.length ? (
										<Actions
											block={{
												items: actionItems,
												align,
											}}
											className="mt-md"
										/>
									) : null}
								</FadeDiv>
								<FadeDiv className={styles.media}>
									<PattermMedia />
									<Media
										block={{
											...item.media,
											rounded: {
												base: 'lg',
											},
										}}
										imageProps={{
											width: 585,
											height: 439,
										}}
										className="p-4 aspect-[4/3]"
									/>
								</FadeDiv>
							</SimpleGrid>
						)
					})}
				</Stack>
				<StyleGap
					id={`${refId}-wrapper`}
					data={gap}
				/>
			</div>
		</FadeContainer>
	)
}

function PatternSolution() {
	return (
		<div className="pointer-events-none inset-0 select-none">
			{/* Left */}
			<div
				className="absolute inset-y-0 my-[-5rem] w-px"
				style={{
					maskImage:
						'linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)',
				}}
			>
				<svg
					className="size-full"
					preserveAspectRatio="none"
				>
					<line
						x1="0"
						y1="0"
						x2="0"
						y2="100%"
						className="stroke-gray-300"
						strokeWidth="2"
						strokeDasharray="3 3"
					/>
				</svg>
			</div>

			{/* Right */}
			<div
				className="absolute inset-y-0 right-0 my-[-5rem] w-px"
				style={{
					maskImage:
						'linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)',
				}}
			>
				<svg
					className="size-full"
					preserveAspectRatio="none"
				>
					<line
						x1="0"
						y1="0"
						x2="0"
						y2="100%"
						className="stroke-gray-300"
						strokeWidth="2"
						strokeDasharray="3 3"
					/>
				</svg>
			</div>
			{/* Middle */}
			<div
				className="absolute inset-y-0 left-1/2 -z-10 my-[-5rem] w-px"
				style={{
					maskImage:
						'linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)',
				}}
			>
				<svg
					className="size-full"
					preserveAspectRatio="none"
				>
					<line
						x1="0"
						y1="0"
						x2="0"
						y2="100%"
						className="stroke-gray-300"
						strokeWidth="2"
						strokeDasharray="3 3"
					/>
				</svg>
			</div>
			{/* 25% */}
			<div
				className="absolute inset-y-0 left-1/4 -z-10 my-[-5rem] hidden w-px sm:block"
				style={{
					maskImage:
						'linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)',
				}}
			>
				<svg
					className="size-full"
					preserveAspectRatio="none"
				>
					<line
						x1="0"
						y1="0"
						x2="0"
						y2="100%"
						className="stroke-gray-300"
						strokeWidth="2"
						strokeDasharray="3 3"
					/>
				</svg>
			</div>
			{/* 75% */}
			<div
				className="absolute inset-y-0 left-3/4 -z-10 my-[-5rem] hidden w-px sm:block"
				style={{
					maskImage:
						'linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)',
				}}
			>
				<svg
					className="size-full"
					preserveAspectRatio="none"
				>
					<line
						x1="0"
						y1="0"
						x2="0"
						y2="100%"
						className="stroke-gray-300"
						strokeWidth="2"
						strokeDasharray="3 3"
					/>
				</svg>
			</div>
		</div>
	)
}

function PattermMedia() {
	return (
		<svg className="absolute z-0 top-0 left-0 size-full">
			<defs>
				<pattern
					id="diagonal-feature-pattern"
					patternUnits="userSpaceOnUse"
					width="64"
					height="64"
				>
					<path
						d="M-106 110L22 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-98 110L30 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-90 110L38 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-82 110L46 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-74 110L54 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-66 110L62 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-58 110L70 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-50 110L78 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-42 110L86 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-34 110L94 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-26 110L102 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-18 110L110 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-10 110L118 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M-2 110L126 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M6 110L134 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M14 110L142 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
					<path
						d="M22 110L150 -18"
						className="stroke-gray-200/70"
						strokeWidth="1"
					></path>
				</pattern>
			</defs>
			<rect
				width="100%"
				height="100%"
				fill="url(#diagonal-feature-pattern)"
			></rect>
		</svg>
	)
}
