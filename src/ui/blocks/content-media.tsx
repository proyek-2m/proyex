'use client'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import { MediaInner } from '$blocks/media'
import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import type { Actions as ActionsBlock, ContentMedia as ContentMediaBlock } from '$payload-types'
import { slugify } from '$utils/common'
import { cx, gapVars } from '$utils/styles'

import styles from '$styles/blocks/content-media.module.css'

export type ContentMediaProps = {
	block: ContentMediaBlock | Omit<ContentMediaBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ContentMedia({ block, withContainer, ...props }: ContentMediaProps) {
	if (!withContainer) {
		return (
			<ContentMediaInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="content-media"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ContentMediaInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ContentMediaInner({ block, ...props }: Omit<ContentMediaProps, 'withContainer'>) {
	const compId = useId()

	const refId = useMemo(() => {
		return block.blockName || props.id || slugify(compId)
	}, [block, props, compId])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '40px',
			vertical: block.gap?.vertical || '28px',
		}
	}, [block.gap])

	const actionItems = useMemo((): ActionsBlock['items'] => {
		return block.actions?.map((action, index) => ({
			...action,
			variant: action.variant || index !== 0 ? 'light' : 'filled',
		}))
	}, [block.actions])

	return (
		<div
			{...props}
			id={refId}
			data-slot="content-media-inner"
			data-align={block.align}
			data-mobile-position={block.mobilePosition || 'media-content'}
			data-desktop-position={block.desktopPosition || 'content-media'}
			className={cx(styles.content_media, gapVars(gap)?.classNameWrapper, props.className)}
		>
			<div className={cx(styles.content, gapVars(gap)?.classNameInner)}>
				<BaseContent
					block={{
						...block.content,
						textColor: block.textColor,
						featuredTextColor: block.featuredTextColor,
					}}
				/>
				<Actions
					block={{
						items: actionItems,
						direction: 'column',
					}}
					className={styles.actions}
				/>
			</div>
			<div className={cx(styles.media, gapVars(gap)?.classNameInner)}>
				<MediaInner
					block={{
						...block.media,
						rounded: {
							base: 'lg',
						},
					}}
					imageProps={{
						width: 686,
						height: 686,
					}}
				/>
			</div>
			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}
