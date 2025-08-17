'use client'
import { useMemo, type HTMLAttributes } from 'react'

import Icon from '$components/Icon'
import type { Divider as DividerBlock } from '$payload-types'
import { colorVars, cx } from '$utils/styles'

import styles from '$styles/blocks/divider.module.css'

export type DividerProps = {
	block: DividerBlock | Omit<DividerBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Divider({ block, withContainer, ...props }: DividerProps) {
	if (!withContainer) {
		return (
			<DividerInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="divider"
			id={block.blockName || props.id}
		>
			<DividerInner
				block={block}
				className="container"
			/>
		</section>
	)
}

function DividerInner({ block, ...props }: Omit<DividerProps, 'withContainer'>) {
	const color = useMemo(() => {
		return {
			...block.color,
			base: block.color?.base || 'gray-soft',
		}
	}, [block.color])

	const icon = useMemo(() => {
		return block.icon || 'sprout'
	}, [block.icon])

	return (
		<div
			{...props}
			data-slot="divider-inner"
			className={cx(styles.wrapper, props.className)}
		>
			<div
				className={styles.divider}
				style={{
					['--color' as string]: colorVars(color),
					height: block.height ? `${block.height}px` : '2px',
				}}
			/>
			<Icon
				name={icon}
				className={styles.icon}
			/>
		</div>
	)
}
