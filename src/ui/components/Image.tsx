'use client'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'

import type { Asset } from '$payload-types'
import { assetUrl } from '$utils/common'

export type ImageProps = Omit<NextImageProps, 'src' | 'alt'> & {
	src: Asset | number | NextImageProps['src'] | null | undefined
	alt?: string
}

const fallbackImage = '/images/placeholder.jpg'

export default function Image({ src, quality = 90, ...props }: ImageProps) {
	if (!src) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				{...props}
				src={fallbackImage}
				loading={props.loading || 'lazy'}
				alt={props.alt || ''}
				fetchPriority={props.fetchPriority || 'low'}
			/>
		)
	}

	if (typeof src === 'object' && 'id' in src) {
		return (
			<NextImage
				{...props}
				src={assetUrl(src) || fallbackImage}
				alt={props.alt || src.alt || ''}
				width={props.width || src.width || undefined}
				height={props.height || src.height || undefined}
				quality={quality}
			/>
		)
	}

	if (typeof src === 'number') {
		if (props.width && props.height) {
			return (
				<NextImage
					{...props}
					src={assetUrl(src) || fallbackImage}
					alt={props.alt || ''}
					quality={quality}
				/>
			)
		}

		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				{...props}
				src={assetUrl(src) || fallbackImage}
				loading={props.loading || 'lazy'}
				alt={props.alt || ''}
			/>
		)
	}

	if (typeof src === 'string') {
		if (props.width && props.height) {
			return (
				<NextImage
					{...props}
					src={src}
					alt={props.alt || ''}
					quality={quality}
				/>
			)
		}

		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				{...props}
				src={src}
				loading={props.loading || 'lazy'}
				alt={props.alt || ''}
			/>
		)
	}

	return (
		<NextImage
			{...props}
			src={src}
			alt={props.alt || ''}
			quality={quality}
		/>
	)
}
