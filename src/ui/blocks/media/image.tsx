'use client'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Image, { type ImageProps } from '$components/Image'
import Link from '$components/Link'
import type { Media as MediaBlock } from '$payload-types'
import { assetUrl, slugify } from '$utils/common'
import { cx, objectFitCls, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/media.module.css'

export type MediaImageProps = {
	block?: MediaBlock | Omit<MediaBlock, 'blockType'>
	imageProps?: Omit<ImageProps, 'src'>
} & HTMLAttributes<HTMLDivElement>

export default function MediaImage({ block, imageProps, ...props }: MediaImageProps) {
	const compId = useId()
	const [openModal, { close: setCloseModal, open: setOpenModal }] = useDisclosure(false)

	const refId = useMemo(() => {
		return block?.blockName || props.id || slugify(compId)
	}, [block, props, compId])

	const src = useMemo(() => {
		if (block?.source === 'internal' && block.imageInternal) {
			return assetUrl(block.imageInternal)
		}

		if (block?.source === 'external' && block.imageExternal) {
			return block.imageExternal
		}

		return null
	}, [block])

	const rounded = useMemo(() => {
		return {
			...block?.rounded,
			base: block?.rounded?.base || 'xl',
		}
	}, [block])

	const aspectRatio = useMemo(() => {
		return block?.aspectRatio || '16/9'
	}, [block])

	const objectFit = useMemo(() => {
		return block?.objectFit || 'cover'
	}, [block])

	return (
		<figure
			{...props}
			id={refId}
			className={cx(styles.media, props.className)}
		>
			{block?.action === 'link' && block.actionLink ? (
				<Link
					href={block.actionLink}
					className={styles.inner}
				>
					<Image
						{...imageProps}
						width={imageProps?.width || 1170}
						height={imageProps?.height || 1170}
						src={src}
						className={objectFitCls(objectFit)}
						style={{
							...imageProps?.style,
							borderRadius: radiusVars(rounded),
							aspectRatio,
						}}
					/>
				</Link>
			) : (
				<div className={styles.inner}>
					<Image
						{...imageProps}
						src={src}
						width={imageProps?.width || 1170}
						height={imageProps?.height || 1170}
						style={{
							...imageProps?.style,
							borderRadius: radiusVars(rounded),
							aspectRatio,
						}}
						onClick={(e) => {
							if (block?.action === 'lightbox') {
								setOpenModal()
							}

							if (imageProps?.onClick) {
								imageProps.onClick(e)
							}
						}}
						className={cx(
							block?.action === 'lightbox' && 'cursor-pointer',
							objectFitCls(objectFit),
						)}
					/>
				</div>
			)}

			{block?.action === 'lightbox' ? (
				<Modal
					size="var(--container)"
					yOffset="16px"
					xOffset="16px"
					centered
					title="Preview Gambar Fullscreen"
					classNames={{
						title: '!text-md !font-bold',
						root: 'relative z-max',
					}}
					opened={openModal}
					onClose={setCloseModal}
					closeOnEscape
					closeOnClickOutside
				>
					<Image
						{...imageProps}
						src={src}
						width={imageProps?.width || 1170}
						height={imageProps?.height || 1170}
						style={{
							borderRadius: radiusVars(rounded),
						}}
						className="w-full object-contain"
					/>
				</Modal>
			) : null}
		</figure>
	)
}
