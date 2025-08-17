import { type HTMLAttributes } from 'react'

import ShowBlocks from '$blocks/show-blocks'
import type { ShowReusable as ShowReusableBlock } from '$payload-types'

export type ShowReusableProps = {
	block: ShowReusableBlock
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ShowReusable({ block, ...props }: ShowReusableProps) {
	if (!block.reusable || typeof block.reusable !== 'object') return null

	return (
		<ShowBlocks
			{...props}
			block={block.reusable.content}
		/>
	)
}
