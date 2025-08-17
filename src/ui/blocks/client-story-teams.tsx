'use client'
import { Stack, Text } from '@mantine/core'
import { useId, useMemo, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Image from '$components/Image'
import Link from '$components/Link'
import type { ClientStoryTeams as ClientStoryTeamsBlock } from '$payload-types'
import { collectionLink } from '$utils/common'
import { colorVars } from '$utils/styles'

import styles from '$styles/blocks/client-story-teams.module.css'

export type ClientStoryTeamsProps = {
	block: ClientStoryTeamsBlock | Omit<ClientStoryTeamsBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ClientStoryTeams({
	block,
	withContainer,
	...props
}: ClientStoryTeamsProps) {
	if (!withContainer) {
		return (
			<ClientStoryTeamsInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="client-story-teams"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ClientStoryTeamsInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ClientStoryTeamsInner({ block, ...props }: Omit<ClientStoryTeamsProps, 'withContainer'>) {
	const compId = useId()

	const client = useMemo(() => {
		if (typeof block.client === 'object') {
			return block.client
		}

		return null
	}, [block.client])

	const teams = useMemo(() => {
		return client?.teams?.filter((team) => typeof team === 'object') || []
	}, [client])

	return (
		<div
			{...props}
			data-slot="client-story-teams-inner"
			style={{
				...props.style,
				color: colorVars(block.textColor),
			}}
			className={styles.client_story_teams}
		>
			{teams.map((team, index) => {
				if (typeof team !== 'object') return null

				return (
					<Image
						key={`${compId}-team-${index}`}
						src={client?.representationAvatar}
						width={72}
						height={72}
						fetchPriority="low"
						className={styles.avatar}
					/>
				)
			})}
			<blockquote className={styles.story}>{client?.story}</blockquote>
			<Stack
				align="center"
				gap={0}
			>
				{client?.representationName ? (
					<Text
						component="span"
						size="sm"
						fw={600}
					>
						{client.representationName}
						{client?.representationPosition ? (
							<> ({client.representationPosition})</>
						) : null}
					</Text>
				) : null}
				{client?.name ? (
					<Text
						component={Link}
						href={collectionLink(client.link)}
						c="primary"
					>
						{client.name}
					</Text>
				) : null}
			</Stack>
		</div>
	)
}
