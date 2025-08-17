'use client'
import { type HTMLAttributes, useMemo } from 'react'

import { useIsMedia } from '$hooks/media-query'
import type { Spacing as SpacingBlock } from '$payload-types'

export type SpacingProps = {
	block: SpacingBlock
} & HTMLAttributes<HTMLDivElement>

export default function Spacing({ block, ...props }: SpacingProps) {
	const isMedia = useIsMedia()

	const height = useMemo(() => {
		const defaultHeight = block.height || 0

		if (isMedia.mobile) {
			return block.heightMobile || defaultHeight
		}

		if (isMedia.tablet) {
			return block.heightTablet || defaultHeight
		}

		return defaultHeight
	}, [block, isMedia])

	return (
		<section
			{...props}
			data-slot="spacing"
			id={block.blockName || props.id}
			style={{
				...props.style,
				height,
			}}
		/>
	)
}
