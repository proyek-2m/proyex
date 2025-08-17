import { useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import { FadeContainer, FadeDiv } from '$components/Fade'
import Richtext from '$components/Richtext'
import type { ContentCtaCard as ContentCtaCardBlock } from '$payload-types'
import { colorVars, cx, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/content-cta-card.module.css'

export type ContentCtaCardProps = {
	block: ContentCtaCardBlock | Omit<ContentCtaCardBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ContentCtaCard({ block, withContainer, ...props }: ContentCtaCardProps) {
	if (!withContainer) {
		return (
			<ContentCtaCardInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			id={block.blockName || props.id}
			data-slot="content-cta-card"
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ContentCtaCardInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ContentCtaCardInner({ block, ...props }: Omit<ContentCtaCardProps, 'withContainer'>) {
	const rounded = useMemo(() => {
		return {
			...block.rounded,
			base: block.rounded?.base || 'lg',
		}
	}, [block])

	const textColor = useMemo(() => {
		return {
			...block.textColor,
			base: block.textColor?.base || 'base',
		}
	}, [block])

	const backgroundColor = useMemo(() => {
		return {
			...block.backgroundColor,
			base: block.backgroundColor?.base || 'primary-soft',
		}
	}, [block])

	return (
		<div
			{...props}
			data-slot="content-cta-card-inner"
			className={cx(styles.card, props.className)}
			style={{
				...props.style,
				borderRadius: radiusVars(rounded),
				color: colorVars(textColor),
				backgroundColor: colorVars(backgroundColor),
			}}
		>
			<Richtext
				data={block.content}
				className={styles.content}
			/>
			{block.actions && block.actions.length ? (
				<Actions
					block={{
						items: block.actions,
						align: 'right',
					}}
					className={styles.actions}
				/>
			) : null}
		</div>
	)
}
