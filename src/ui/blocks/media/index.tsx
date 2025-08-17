'use client'
import dynamic from 'next/dynamic'
import { type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { type ImageProps } from '$components/Image'
import type { Media as MediaBlock } from '$payload-types'
import { Skeleton } from '@mantine/core'

const MediaImage = dynamic(() => import('./image'), {
	ssr: false,
	loading: () => <Skeleton className="w-full aspect-video rounded-xl" />,
})

const MediaVideo = dynamic(() => import('./video'), {
	ssr: false,
	loading: () => <Skeleton className="w-full aspect-video rounded-xl" />,
})

export type MediaProps = {
	block?: MediaBlock | Omit<MediaBlock, 'blockType'>
	imageProps?: Omit<ImageProps, 'src'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Media({ block, imageProps, withContainer, ...props }: MediaProps) {
	if (!withContainer) {
		return (
			<MediaInner
				{...props}
				block={block}
				imageProps={imageProps}
			/>
		)
	}

	return (
		<section
			{...props}
			id={block?.blockName || props.id}
			data-slot="media"
		>
			<FadeContainer className="container">
				<FadeDiv>
					<MediaInner
						block={block}
						imageProps={imageProps}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

export function MediaInner({ block, imageProps, ...props }: Omit<MediaProps, 'withContainer'>) {
	if (block?.type === 'video') {
		return (
			<MediaVideo
				block={block}
				data-slot="media-inner"
				{...props}
			/>
		)
	}

	return (
		<MediaImage
			block={block}
			imageProps={imageProps}
			data-slot="media-inner"
			{...props}
		/>
	)
}
