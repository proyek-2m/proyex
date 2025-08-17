'use client'
import { useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import { FadeContainer, FadeDiv } from '$components/Fade'
import type { Actions as ActionsBlock, HeadingListing as HeadingListingBlock } from '$payload-types'
import { cx } from '$utils/styles'

import styles from '$styles/blocks/heading-listing.module.css'

export type HeadingListingProps = {
	block: HeadingListingBlock | Omit<HeadingListingBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function HeadingListing({ block, withContainer, ...props }: HeadingListingProps) {
	if (!withContainer) {
		return (
			<HeadingListingInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-listing"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<HeadingListingInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function HeadingListingInner({ block, ...props }: Omit<HeadingListingProps, 'withContainer'>) {
	const align = useMemo(() => {
		return block.align || 'center'
	}, [block.align])

	const actionItems = useMemo((): ActionsBlock['items'] => {
		return (
			block.actions?.map((action) => ({
				...action,
				variant: action.variant || 'light',
				size: action.size || 'sm',
				rounded: {
					...action.rounded,
					base: action.rounded?.base || 'md',
				},
			})) || []
		)
	}, [block.actions])

	return (
		<div
			{...props}
			data-slot="heading-listing-inner"
			data-align={align}
			className={cx(styles.heading_listing, props.className)}
		>
			<BaseContent
				block={{
					...block.content,
					textColor: block.textColor,
					featuredTextColor: block.featuredTextColor,
					align: align === 'center' ? 'center' : 'left',
				}}
				className={styles.content}
			/>
			{actionItems && actionItems.length ? (
				<Actions
					block={{
						items: actionItems,
						align: align === 'center' ? 'center' : 'right',
					}}
					className={styles.actions}
				/>
			) : null}
		</div>
	)
}
