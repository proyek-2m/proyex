import { useMemo, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Richtext from '$components/Richtext'
import ContactForm from '$layouts/ContactForm'
import type { CardForm as CardFormBlock } from '$payload-types'
import { cx, paddingVars, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/card-form.module.css'

export type CardFormProps = {
	block: CardFormBlock | Omit<CardFormBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function CardForm({ block, withContainer, ...props }: CardFormProps) {
	if (!withContainer) {
		return (
			<CardFormInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			id={block.blockName || props.id}
			data-slot="card-form"
		>
			<FadeContainer className="container">
				<FadeDiv>
					<CardFormInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function CardFormInner({ block, ...props }: Omit<CardFormProps, 'withContainer'>) {
	const rounded = useMemo(() => {
		return {
			...block.rounded,
			base: block.rounded?.base || 'lg',
		}
	}, [block])

	if (!block.form) {
		return null
	}

	return (
		<div
			{...props}
			data-slot="card-form-inner"
			className={cx(styles.card_form, props.className)}
			style={{
				...props.style,
				...paddingVars(block?.padding),
				borderRadius: radiusVars(rounded),
			}}
		>
			<Richtext
				data={block.heading}
				className={styles.content}
			/>
			<ContactForm data={block.form} />
		</div>
	)
}
