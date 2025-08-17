'use client'
import { useId, useMemo } from 'react'

import HeadingListing from '$blocks/heading-listing'
import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { ClientLogoCard, type ClientLogoCardProps } from '$layouts/Client'
import { slugify } from '$utils/common'
import { type FeaturedListingClientProps } from './server'

import styles from '$styles/blocks/featured-listing-client.module.css'
import { Text } from '@mantine/core'

export type FeaturedListingClientClientProps = Omit<FeaturedListingClientProps, 'queried'> & {
	clients: ClientLogoCardProps['data'][]
}

export default function FeaturedListingClientClient({
	block,
	clients,
	withContainer,
	...props
}: FeaturedListingClientClientProps) {
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
}: Omit<FeaturedListingClientClientProps, 'withContainer'>) {
	const compId = useId()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 6
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '16px',
			vertical: block.gap?.vertical || block.gap?.base || '16px',
		}
	}, [block.gap])

	return (
		<div
			{...props}
			data-slot="listing-client-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			{block.content?.content || block.content?.featuredText || block.actions?.length ? (
				<HeadingListing
					block={{
						content: block.content,
						actions: block.actions,
						align: 'between',
						textColor: block.textColor,
						featuredTextColor: block.featuredTextColor,
					}}
					className={styles.heading_listing}
				/>
			) : null}

			{clients.length ? (
				<div className={styles.listing}>
					{clients.map((client, index) => (
						<ClientLogoCard
							key={`${compId}-client-${index}`}
							data={client}
						/>
					))}
				</div>
			) : (
				<Text
					c="dimmed"
					ta="center"
				>
					Klien2M tidak ditemukan
				</Text>
			)}

			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}
