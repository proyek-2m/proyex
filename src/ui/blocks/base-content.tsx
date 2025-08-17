import { Notification } from '@mantine/core'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { useMemo, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Richtext from '$components/Richtext'
import type { BaseContent as BaseContentBlock } from '$payload-types'
import { colorVars, cx } from '$utils/styles'

import styles from '$styles/blocks/base-content.module.css'

type Props = HTMLAttributes<HTMLDivElement> & {
	withContainer?: boolean
} & (
		| {
				block: BaseContentBlock | Omit<BaseContentBlock, 'blockType'>
				data?: undefined
		  }
		| {
				block?: undefined
				data: DefaultTypedEditorState | null | undefined
		  }
	)

export default function BaseContent({ block, data, withContainer, ...props }: Props) {
	if (!withContainer) {
		return (
			<BaseContentInner
				{...props}
				block={block}
				data={data}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="base-content"
			id={block?.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<BaseContentInner
						block={block}
						data={data}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function BaseContentInner({ block, data, ...props }: Omit<Props, 'withContainer'>) {
	const featuredTextColor = useMemo(() => {
		return {
			...block?.featuredTextColor,
			base: block?.featuredTextColor?.base || 'primary',
		}
	}, [block?.featuredTextColor])

	return (
		<div
			{...props}
			data-slot="base-content-inner"
			data-align={block?.align}
			className={cx(styles.base_content, props.className)}
		>
			{block?.featuredText ? (
				<Notification
					withCloseButton={false}
					className={styles.featured_text}
					style={{
						['--notification-color']: colorVars(featuredTextColor),
					}}
				>
					<Richtext
						data={block?.featuredText}
						basic
					/>
				</Notification>
			) : null}
			<Richtext data={block?.content || data} />
		</div>
	)
}
