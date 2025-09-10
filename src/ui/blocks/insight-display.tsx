'use client'
import { useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import { MediaInner } from '$blocks/media'
import { FadeContainer, FadeDiv } from '$components/Fade'
import Richtext from '$components/Richtext'
import type { Actions as ActionsBlock, InsightDisplay as InsightDisplayBlock } from '$payload-types'
import { colorVars, cx, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/insight-display.module.css'

export type InsightDisplayProps = {
	block: InsightDisplayBlock | Omit<InsightDisplayBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function InsightDisplay({ block, withContainer, ...props }: InsightDisplayProps) {
	if (!withContainer) {
		return (
			<InsightDisplayInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="insight-display"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<InsightDisplayInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function InsightDisplayInner({ block, ...props }: Omit<InsightDisplayProps, 'withContainer'>) {
	const actionItems = useMemo((): ActionsBlock['items'] => {
		return block?.actions?.map((action) => ({
			...action,
			variant: action.variant || 'light',
			size: action.size || 'sm',
			rounded: {
				...action.rounded,
				base: action.rounded?.base || 'md',
			},
		}))
	}, [block])

	const align = useMemo(() => {
		return block.align || 'center'
	}, [block.align])

	const textColor = useMemo(() => {
		return {
			...block.textColor,
			base: block.textColor?.base || 'white',
		}
	}, [block.textColor])

	const featuredTextColor = useMemo(() => {
		return {
			...block.featuredTextColor,
			base: block.featuredTextColor?.base || 'primary',
		}
	}, [block.featuredTextColor])

	const backgroundColor = useMemo(() => {
		return {
			...block.backgroundColor,
			base: block.backgroundColor?.base || 'gray-dark',
		}
	}, [block.backgroundColor])

	const rounded = useMemo(() => {
		return {
			...block?.rounded,
			base: block?.rounded?.base || 'xl',
		}
	}, [block.rounded])

	return (
		<div
			{...props}
			data-slot="insight-display-inner"
			data-align={align}
			className={cx(styles.insight_display, props.className)}
			style={{
				...props.style,
				color: colorVars(textColor),
				backgroundColor: colorVars(backgroundColor),
				borderRadius: radiusVars(rounded),
			}}
		>
			<PatternInsight />
			<PatternInsight />

			<div className={styles.content}>
				<Richtext
					data={block.featuredText}
					className={styles.featured_text}
					style={{
						color: colorVars(featuredTextColor),
					}}
				/>

				<Richtext data={block.content} />

				{actionItems && actionItems.length ? (
					<Actions
						block={{
							items: actionItems,
							align,
						}}
						className="mt-md"
					/>
				) : null}
			</div>

			<MediaInner
				block={{
					...block.media,
					aspectRatio: '4/3',
					rounded: {
						base: 'lg',
					},
				}}
				imageProps={{
					width: 896,
					height: 504,
				}}
				className={styles.media}
			/>
		</div>
	)
}

function PatternInsight() {
	return (
		<div className={styles.pattern}>
			<svg
				className={styles.svg}
				style={{
					maskImage:
						'linear-gradient(transparent, white 10rem, white calc(100% - 10rem), transparent)',
				}}
			>
				<defs>
					<pattern
						id="diagonal-border-pattern"
						patternUnits="userSpaceOnUse"
						width="64"
						height="64"
					>
						{Array.from({ length: 17 }, (_, i) => {
							const offset = i * 8
							return (
								<path
									key={i}
									d={`M${-106 + offset} 110L${22 + offset} -18`}
									stroke=""
									strokeWidth="1"
								/>
							)
						})}
					</pattern>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill="url(#diagonal-border-pattern)"
				/>
			</svg>
		</div>
	)
}
