'use client'
import { Carousel as CarouselMantine, CarouselSlide, type CarouselProps } from '@mantine/carousel'
import EmblaClassNames from 'embla-carousel-class-names'
import { useId, type ReactNode } from 'react'

type Props = {
	slides: ReactNode[]
} & Omit<CarouselProps, 'children'>

export default function Carousel({ slides, ...props }: Props) {
	const compId = useId()

	if (slides.length === 0) {
		return null
	}

	return (
		<CarouselMantine
			{...props}
			plugins={[EmblaClassNames()]}
		>
			{slides.map((slide, index) => (
				<CarouselSlide key={`${compId}-${index}`}>{slide}</CarouselSlide>
			))}
		</CarouselMantine>
	)
}
