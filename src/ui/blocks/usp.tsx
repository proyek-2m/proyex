'use client'
import { Text } from '@mantine/core'
import { useId, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Icon from '$components/Icon'
import Richtext from '$components/Richtext'
import type { Usp as UspBlock } from '$payload-types'
import { cx } from '$utils/styles'

import styles from '$styles/blocks/usp.module.css'

export type UspProps = {
	block: UspBlock | Omit<UspBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Usp({ block, withContainer, ...props }: UspProps) {
	if (!withContainer) {
		return (
			<UspInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="usp"
			id={block.blockName || props.id}
		>
			<UspInner
				block={block}
				className="container"
			/>
		</section>
	)
}

function UspInner({ block, ...props }: Omit<UspProps, 'withContainer'>) {
	const compId = useId()

	if (!block.items || block.items.length === 0) {
		return null
	}
	return (
		<FadeContainer data-slot="usp-inner">
			<div
				{...props}
				className={cx(styles.usps, props.className)}
			>
				{block.items.map((usp, index) => {
					return (
						<FadeDiv
							key={`${compId}-${index}`}
							className={styles.usp}
						>
							<div className={styles.heading}>
								<Icon
									name={usp.icon || 'cloud-drizzle'}
									className={styles.icon}
								/>
								<Richtext
									data={usp.title}
									className={styles.title}
									basic
								/>
							</div>
							<Text
								size="sm"
								mt="xs"
							>
								<Richtext
									data={usp.content}
									basic
								/>
							</Text>
						</FadeDiv>
					)
				})}
			</div>
		</FadeContainer>
	)
}
