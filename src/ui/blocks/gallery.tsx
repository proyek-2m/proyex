'use client'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import { SimpleGrid } from '@mantine/core'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Media from '$blocks/media'
import { FadeContainer, FadeDiv } from '$components/Fade'
import type { Gallery as GalleryBlock } from '$payload-types'

import styles from '$styles/blocks/gallery.module.css'

export type GalleryProps = {
	block: GalleryBlock | Omit<GalleryBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Gallery({ block, withContainer, ...props }: GalleryProps) {
	if (!withContainer) {
		return (
			<GalleryInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="gallery"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<GalleryInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function GalleryInner({ block, ...props }: Omit<GalleryProps, 'withContainer'>) {
	const compId = useId()

	const column = useMemo(() => {
		return block.column || 3
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '20px',
			vertical: block.gap?.vertical || block.gap?.base || '20px',
		}
	}, [block.gap])

	const rounded = useMemo(() => {
		return {
			...block?.rounded,
			base: block?.rounded?.base || 'xl',
		}
	}, [block])

	const aspectRatio = useMemo(() => {
		return block?.aspectRatio || '4/3'
	}, [block])

	const objectFit = useMemo(() => {
		return block?.objectFit || 'cover'
	}, [block])

	if (!block.items || block.items.length === 0) {
		return null
	}

	if (block.display === 'grid-slider') {
		return (
			<Carousel
				{...props}
				data-slot="gallery-slider-inner"
				withIndicators
				withControls={false}
				slideSize={`${100 / column}%`}
				slideGap={gap.base || gap.vertical}
				emblaOptions={{
					loop: true,
					align: 'start',
				}}
			>
				{block.items.map((media, index) => (
					<CarouselSlide key={`${compId}-${index}`}>
						<Media
							block={{
								...media,
								rounded,
								aspectRatio,
								objectFit,
							}}
							className={styles.media}
						/>
					</CarouselSlide>
				))}
			</Carousel>
		)
	}

	return (
		<SimpleGrid
			{...props}
			data-slot="gallery-grid-inner"
			cols={{
				base: 1,
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
		>
			{block.items.map((media, index) => (
				<Media
					key={`${compId}-${index}`}
					block={{
						...media,
						rounded,
						aspectRatio,
						objectFit,
					}}
					className={styles.media}
				/>
			))}
		</SimpleGrid>
	)
}
