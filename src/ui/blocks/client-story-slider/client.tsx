'use client'
import { useId, useMemo } from 'react'

import Carousel from '$components/Carousel'
import { FadeContainer, FadeDiv } from '$components/Fade'
import { ClientStoryCard, type ClientStoryCardProps } from '$layouts/Client'
import { gapVars } from '$utils/styles'
import { Text } from '@mantine/core'
import { type ClientStorySliderProps } from './server'

export type ClientStorySliderClientProps = Omit<ClientStorySliderProps, 'queried'> & {
	clients: ClientStoryCardProps['data'][]
}

export default function ClientStorySliderClient({
	block,
	clients,
	withContainer,
	...props
}: ClientStorySliderClientProps) {
	if (!withContainer) {
		return (
			<ListingClientInner
				{...props}
				block={block}
				clients={clients}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-client"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingClientInner
						block={block}
						clients={clients}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingClientInner({
	block,
	clients,
	...props
}: Omit<ClientStorySliderClientProps, 'withContainer'>) {
	const compId = useId()

	const column = useMemo(() => {
		return block.column || 3
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '24px',
			vertical: block.gap?.vertical || block.gap?.base || '24px',
		}
	}, [block.gap])

	if (clients.length === 0) {
		return (
			<div
				data-slot="listing-client-inner"
				{...props}
			>
				<Text
					c="dimmed"
					ta="center"
				>
					Klien2M tidak ditemukan
				</Text>
			</div>
		)
	}

	return (
		<Carousel
			{...props}
			data-slot="listing-client-inner"
			slideSize={{
				base: '100%',
				sm: '50%',
				md: `calc(100% / ${column})`,
			}}
			slideGap={gap.base}
			withIndicators
			withControls={false}
			classNames={{
				viewport: 'p-[var(--gap)]',
			}}
			style={{
				...props.style,
				['--gap']: gapVars(gap)?.vars?.['--gap'],
			}}
			slides={clients.map((client, index) => (
				<ClientStoryCard
					key={`${compId}-client-${index}`}
					data={client}
				/>
			))}
		/>
	)
}
