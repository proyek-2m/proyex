'use client'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import { MediaInner } from '$blocks/media'
import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import type { ContentMediaCard as ContentMediaCardBlock } from '$payload-types'
import { slugify } from '$utils/common'
import { colorVars, cx } from '$utils/styles'

import styles from '$styles/blocks/content-media-card.module.css'

export type ContentMediaCardProps = {
	block: ContentMediaCardBlock | Omit<ContentMediaCardBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ContentMediaCard({
	block,
	withContainer,
	...props
}: ContentMediaCardProps) {
	if (!withContainer) {
		return (
			<ContentMediaCardInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="content-media-card"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ContentMediaCardInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ContentMediaCardInner({ block, ...props }: Omit<ContentMediaCardProps, 'withContainer'>) {
	const compId = useId()

	const refId = useMemo(() => {
		return block.blockName || props.id || slugify(compId)
	}, [block, props, compId])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '68px',
			vertical: block.gap?.vertical || '28px',
		}
	}, [block.gap])

	const backgroundColor = useMemo(() => {
		return {
			...block?.backgroundColor,
			base: block?.backgroundColor?.base || 'gray-soft',
		}
	}, [block])

	return (
		<div
			{...props}
			id={refId}
			data-slot="content-media-card-inner"
			data-align={block.align}
			data-mobile-position={block.mobilePosition || 'media-content'}
			data-desktop-position={block.desktopPosition || 'content-media'}
			className={cx(styles.content_media, props.className)}
			style={{
				...props.style,
				backgroundColor: colorVars(backgroundColor),
			}}
		>
			<div className={styles.content}>
				<BaseContent
					block={{
						...block.content,
						textColor: block.textColor,
						featuredTextColor: block.featuredTextColor,
					}}
				/>
				<Actions
					block={{
						items: block.actions,
					}}
					className={styles.actions}
				/>
			</div>
			<MediaInner
				block={{
					...block.media,
					rounded: {
						base: 'none',
					},
				}}
				imageProps={{
					width: 585,
					height: 585,
				}}
				className={styles.media}
			/>
			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}
