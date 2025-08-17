'use client'
import { Modal, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import { Play } from 'lucide-react'
import { useMemo, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import type { Media as MediaBlock } from '$payload-types'
import { assetUrl } from '$utils/common'
import { cx, objectFitCls, radiusVars } from '$utils/styles'

import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'

export type MediaVideoProps = {
	block?: MediaBlock | Omit<MediaBlock, 'blockType'>
} & HTMLAttributes<HTMLDivElement>

export default function MediaVideo({ block, ...props }: MediaVideoProps) {
	const [openModal, { close: setCloseModal, open: setOpenModal }] = useDisclosure(false)

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

	if (block?.action === 'lightbox') {
		return (
			<figure
				{...props}
				className="relative"
			>
				<Image
					src={assetUrl(block.videoPoster)}
					width={1170}
					height={1170}
					className={cx('cursor-pointer', objectFitCls(objectFit))}
					style={{
						borderRadius: radiusVars(rounded),
						aspectRatio,
					}}
					onClick={setOpenModal}
				/>
				<ThemeIcon
					size="xl"
					variant="light"
					radius="xl"
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
					onClick={setOpenModal}
				>
					<Play />
				</ThemeIcon>
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
					<Video
						{...props}
						block={block}
						rounded={rounded}
						aspectRatio={aspectRatio}
						objectFit={objectFit}
					/>
				</Modal>
			</figure>
		)
	}

	return (
		<figure {...props}>
			<Video
				{...props}
				block={block}
				rounded={rounded}
				aspectRatio={aspectRatio}
				objectFit={objectFit}
			/>
		</figure>
	)
}

export function Video({
	block,
	rounded,
	aspectRatio,
	objectFit,
}: {
	block?: MediaVideoProps['block']
	rounded: MediaBlock['rounded']
	aspectRatio: MediaBlock['aspectRatio']
	objectFit: MediaBlock['objectFit']
}) {
	const src = useMemo(() => {
		if (block?.source === 'internal' && block.videoInternal) {
			return assetUrl(block.videoInternal)
		}

		if (block?.source === 'external' && block.videoExternal) {
			return block.videoExternal
		}

		return null
	}, [block])

	if (!src) {
		return null
	}

	return (
		<MediaPlayer
			src={src}
			crossOrigin
			playsInline
			load={block?.videoOptions?.includes('autoplay') ? 'visible' : 'play'}
			muted={block?.videoOptions?.includes('autoplay')}
			posterLoad="visible"
			viewType="video"
			streamType="on-demand"
			autoPlay={block?.videoOptions?.includes('autoplay')}
			loop={block?.videoOptions?.includes('loop')}
			poster={assetUrl(block?.videoPoster)}
			aspectRatio={aspectRatio || '16/9'}
			style={{
				border: 'none',
				borderRadius: radiusVars(rounded),
			}}
			className="relative overflow-hidden"
		>
			<MediaProvider>
				<Poster className={cx('vds-poster', objectFitCls(objectFit))} />
			</MediaProvider>
			<DefaultVideoLayout icons={defaultLayoutIcons} />
		</MediaPlayer>
	)
}
