import { SimpleGrid } from '@mantine/core'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import { FadeContainer, FadeDiv } from '$components/Fade'
import Icon from '$components/Icon'
import type { ContentCards as ContentCardsBlock } from '$payload-types'
import { colorVars, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/content-cards.module.css'

export type ContentCardsProps = {
	block: ContentCardsBlock | Omit<ContentCardsBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ContentCards({ block, withContainer, ...props }: ContentCardsProps) {
	if (!withContainer) {
		return (
			<ContentCardsInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="content-cards"
			id={block.blockName || props.id}
		>
			<ContentCardsInner
				block={block}
				className="container"
			/>
		</section>
	)
}

function ContentCardsInner({ block, ...props }: Omit<ContentCardsProps, 'withContainer'>) {
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

	const rounded = useMemo(() => {
		return {
			...block?.rounded,
			base: block?.rounded?.base || 'lg',
		}
	}, [block.rounded])

	const iconColor = useMemo(() => {
		return {
			...block.iconColor,
			base: block.iconColor?.base || 'primary-dark',
		}
	}, [block.iconColor])

	const backgroundColor = useMemo(() => {
		return {
			...block?.backgroundColor,
			base: block?.backgroundColor?.base || 'primary-soft',
		}
	}, [block])

	if (!block.items || block.items.length === 0) {
		return null
	}

	return (
		<FadeContainer className="w-full">
			<SimpleGrid
				{...props}
				cols={{
					base: 1,
					sm: 2,
					md: column,
				}}
				spacing={{
					base: 'xs',
					md: gap.base,
				}}
				verticalSpacing={{
					base: 'xs',
					md: gap.vertical,
				}}
				data-slot="content-cards-inner"
				style={{
					['--icon-color']: colorVars(iconColor),
				}}
			>
				{block.items.map((item, index) => {
					const actionItems = item.actions?.map((action) => ({
						...action,
						variant: action.variant || 'outline',
						size: action.size || 'sm',
						rounded: {
							...action.rounded,
							base: action.rounded?.base || 'md',
						},
					}))

					return (
						<FadeDiv
							key={`${compId}-${index}`}
							className={styles.card}
							style={{
								borderRadius: radiusVars(rounded),
								backgroundColor: colorVars(backgroundColor),
							}}
						>
							<BaseContent
								block={{
									content: item.content,
									textColor: block.textColor,
								}}
							/>

							{actionItems && actionItems.length ? (
								<Actions
									block={{
										items: actionItems,
									}}
									className="mt-md"
								/>
							) : null}

							<Icon
								name={item.icon}
								className={styles.icon}
							/>
						</FadeDiv>
					)
				})}
			</SimpleGrid>
		</FadeContainer>
	)
}
