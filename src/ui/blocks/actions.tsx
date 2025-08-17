'use client'

import { useId, useMemo, type HTMLAttributes } from 'react'

import Button from '$blocks/button'
import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import type { Actions as ActionsBlock } from '$payload-types'
import { slugify } from '$utils/common'
import { cx, gapVars } from '$utils/styles'

import styles from '$styles/blocks/actions.module.css'

export type ActionsProps = {
	block: ActionsBlock | Omit<ActionsBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Actions({ block, withContainer, ...props }: ActionsProps) {
	if (!withContainer) {
		return (
			<ActionsInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="actions"
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ActionsInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ActionsInner({ block, ...props }: ActionsProps) {
	const compId = useId()

	const refId = useMemo(() => {
		return block.blockName || props.id || slugify(compId)
	}, [block, props, compId])

	const gap = useMemo(() => {
		return {
			...block.gap,
			base: block.gap?.base || '10px',
		}
	}, [block.gap])

	if (!block.items || block.items.length === 0) {
		return null
	}

	return (
		<>
			<div
				id={refId}
				data-align={block.align}
				data-direction={block.direction}
				className={cx(styles.actions, gapVars(gap)?.className, props.className)}
			>
				{block.items.map((action, index) => (
					<Button
						key={`${compId}-action-${index}`}
						block={action}
					/>
				))}
			</div>
			<StyleGap
				id={refId}
				data={gap}
			/>
		</>
	)
}
