'use client'
import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from '@mantine/core'
import { Plus } from 'lucide-react'
import { useId, useMemo, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Icon from '$components/Icon'
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import type { CollapsibleTab as CollapsibleTabBlock } from '$payload-types'
import { slugify } from '$utils/common'
import { colorVars, cx, gapVars } from '$utils/styles'

import styles from '$styles/blocks/collapsible-tab.module.css'

export type CollapsibleTabProps = {
	block: CollapsibleTabBlock | Omit<CollapsibleTabBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function CollapsibleTab({ block, withContainer, ...props }: CollapsibleTabProps) {
	if (!withContainer) {
		return (
			<CollapsibleTabInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="collapsible-tab"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<CollapsibleTabInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function CollapsibleTabInner({ block, ...props }: Omit<CollapsibleTabProps, 'withContainer'>) {
	const compId = useId()

	const refId = useMemo(() => {
		return block.blockName || props.id || slugify(compId)
	}, [block.blockName, compId, props.id])

	const variant = useMemo(() => {
		return block.variant || 'separated'
	}, [block.variant])

	const iconColor = useMemo(() => {
		return {
			...block.iconColor,
			base: block.iconColor?.base || 'primary',
		}
	}, [block.iconColor])

	const column = useMemo(() => {
		if (variant !== 'separated') {
			return 1
		}

		return block.column || 1
	}, [variant, block.column])

	const gap = useMemo(() => {
		if (variant !== 'separated') {
			return undefined
		}

		return {
			...block.gap,
			base: block.gap?.base || '12px',
			vertical: block.gap?.vertical || block.gap?.base || '12px',
		}
	}, [block.gap, variant])

	if (!block.items || block.items.length === 0) {
		return null
	}

	return (
		<Accordion
			data-slot="collapsible-tab-inner"
			id={refId}
			variant={variant}
			chevron={<Plus />}
			chevronSize={20}
			radius="lg"
			classNames={{ chevron: styles.chevron }}
			className={cx(gapVars(gap)?.className, props.className)}
			style={{
				...props.style,
				['--column']: column,
			}}
		>
			{block.items.map((item, index) => (
				<AccordionItem
					key={`${compId}-${index}`}
					value={`${compId}-${index}`}
				>
					<AccordionControl
						icon={
							item.icon ? (
								<Icon
									name={item.icon}
									style={{
										color: colorVars(iconColor),
									}}
								/>
							) : undefined
						}
						className={styles.heading}
					>
						<Richtext
							data={item.heading}
							basic
						/>
					</AccordionControl>
					<AccordionPanel>
						<Richtext data={item.content} />
					</AccordionPanel>
				</AccordionItem>
			))}

			<StyleGap
				id={refId}
				data={gap}
			/>
		</Accordion>
	)
}
