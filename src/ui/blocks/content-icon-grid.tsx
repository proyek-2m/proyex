import { SimpleGrid, Title } from '@mantine/core'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import { FadeContainer, FadeDiv } from '$components/Fade'
import Icon from '$components/Icon'
import Richtext from '$components/Richtext'
import type { ContentIconGrid as ContentIconGridBlock } from '$payload-types'
import { cx } from '$utils/styles'

import styles from '$styles/blocks/content-icon-grid.module.css'

export type ContentIconGridProps = {
	block: ContentIconGridBlock | Omit<ContentIconGridBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ContentIconGrid({ block, withContainer, ...props }: ContentIconGridProps) {
	if (!withContainer) {
		return (
			<ContentIconGridInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="content-icon-grid"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ContentIconGridInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ContentIconGridInner({ block, ...props }: Omit<ContentIconGridProps, 'withContainer'>) {
	const compId = useId()

	const column = useMemo(() => {
		return block.column || 2
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '40px',
			vertical: block.gap?.vertical || '40px',
		}
	}, [block.gap])

	const actionItems = useMemo(() => {
		return block.actions?.map((action) => ({
			...action,
			variant: action.variant || 'light',
		}))
	}, [block.actions])

	if (!block.items || block.items.length === 0) {
		return null
	}

	return (
		<div
			{...props}
			data-slot="content-icon-grid-inner"
			data-position={block.position || 'content-usps'}
			className={cx(styles.content_icon_grid, props.className)}
		>
			<div className={styles.content}>
				{block.content ? <BaseContent block={block.content} /> : null}

				{actionItems && actionItems.length ? (
					<Actions
						block={{
							items: actionItems,
						}}
						className="mt-md"
					/>
				) : null}
			</div>

			<SimpleGrid
				cols={{
					base: 1,
					sm: 2,
					md: column,
				}}
				spacing={{
					base: 'lg',
					md: gap.base,
				}}
				verticalSpacing={{
					base: 'lg',
					md: gap.vertical,
				}}
				className={styles.usps}
			>
				{block.items.map((item, index) => (
					<div key={`${compId}-${index}`}>
						<Icon
							name={item.icon}
							className={styles.icon}
						/>
						<Title
							order={4}
							className={styles.title}
						>
							<Richtext
								data={item.title}
								basic
							/>
						</Title>
						<BaseContent
							block={{
								content: item.content,
							}}
							className={styles.usp_content}
						/>
					</div>
				))}
			</SimpleGrid>
		</div>
	)
}
