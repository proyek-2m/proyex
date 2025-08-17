'use client'
import { Anchor, Card, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { useId, type ComponentProps, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import type { Team } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import stylesTeamCard from '$styles/layouts/team-card.module.css'
import stylesTeamGrid from '$styles/layouts/team-grid.module.css'

export type TeamCardProps = {
	data: Pick<Team, 'title' | 'link' | 'gender' | 'avatar' | 'positions' | 'featuredImage'>
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Card>

export function TeamCard({ data, ...props }: TeamCardProps) {
	const compId = useId()

	return (
		<Card
			{...props}
			padding="xl"
			radius="lg"
			withBorder
			data-gender={data.gender}
			className={cx(stylesTeamCard.card, props.className)}
		>
			<Link
				href={collectionLink(data.link)}
				className={stylesTeamCard.thumbnail}
			>
				<Image
					src={data.avatar || data.featuredImage}
					width={128}
					height={128}
				/>
			</Link>

			<Stack
				align="center"
				gap={4}
			>
				<Title
					order={5}
					className={stylesTeamCard.title}
				>
					<Link href={collectionLink(data.link)}>{data.title}</Link>
				</Title>
				{data.positions && data.positions.length ? (
					<Group
						justify="center"
						className={stylesTeamCard.positions}
					>
						{data.positions.map((position, index) => {
							if (typeof position !== 'object') return null

							return (
								<Text
									component="span"
									ta="center"
									key={`${compId}-position-${position.id}`}
								>
									<Anchor
										component={Link}
										href={collectionLink(position.link)}
										size="sm"
										underline="not-hover"
									>
										{position.title}
									</Anchor>
									{index < data.positions!.length - 1 ? ', ' : ''}
								</Text>
							)
						})}
					</Group>
				) : null}
			</Stack>
		</Card>
	)
}

export function SkeletonTeamCard(props: Partial<TeamCardProps>) {
	return (
		<Card
			{...props}
			padding="xl"
			radius="lg"
			withBorder
			className={cx(stylesTeamCard.card, props.className)}
		>
			<Skeleton className={stylesTeamCard.thumbnail} />

			<Stack
				align="center"
				gap={4}
			>
				<Skeleton
					w="65%"
					h={25}
					className={stylesTeamCard.title}
				/>
				<Skeleton
					w="45%"
					h={20}
					className={stylesTeamCard.positions}
				/>
			</Stack>
		</Card>
	)
}

export type TeamGridProps = {
	data: Pick<Team, 'title' | 'link' | 'gender' | 'avatar' | 'positions' | 'featuredImage'>
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Card>

export function TeamGrid({ data, ...props }: TeamGridProps) {
	const compId = useId()

	return (
		<div
			{...props}
			data-gender={data.gender}
			className={cx(stylesTeamGrid.grid, props.className)}
		>
			<Link
				href={collectionLink(data.link)}
				className={stylesTeamGrid.thumbnail}
			>
				<Image
					src={data.avatar || data.featuredImage}
					width={264}
					height={350}
				/>
			</Link>

			<Stack
				align="center"
				gap={4}
			>
				<Title
					order={5}
					className={stylesTeamGrid.title}
				>
					<Link href={collectionLink(data.link)}>{data.title}</Link>
				</Title>
				{data.positions && data.positions.length ? (
					<Group
						justify="center"
						className={stylesTeamGrid.positions}
					>
						{data.positions.map((position, index) => {
							if (typeof position !== 'object') return null

							return (
								<Text
									component="span"
									ta="center"
									key={`${compId}-position-${position.id}`}
								>
									<Anchor
										component={Link}
										href={collectionLink(position.link)}
										size="sm"
										underline="not-hover"
									>
										{position.title}
									</Anchor>
									{index < data.positions!.length - 1 ? ', ' : ''}
								</Text>
							)
						})}
					</Group>
				) : null}
			</Stack>
		</div>
	)
}

export function SkeletonTeamGrid(props: Partial<TeamGridProps>) {
	return (
		<div
			{...props}
			className={cx(stylesTeamGrid.card, props.className)}
		>
			<Skeleton className={stylesTeamGrid.thumbnail} />

			<Stack
				align="center"
				gap={4}
			>
				<Skeleton
					w="65%"
					h={25}
					className={stylesTeamGrid.title}
				/>
				<Skeleton
					w="45%"
					h={20}
					className={stylesTeamGrid.positions}
				/>
			</Stack>
		</div>
	)
}
