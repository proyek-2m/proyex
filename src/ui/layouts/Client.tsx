'use client'
import { Card, Skeleton, Stack, Text, Title } from '@mantine/core'
import { Quote } from 'lucide-react'
import { type ComponentProps, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import { useRouter } from '$hooks/use-router'
import type { Client } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import stylesClientCard from '$styles/layouts/client-card.module.css'
import stylesClientLogoCard from '$styles/layouts/client-logocard.module.css'
import stylesClientStoryCard from '$styles/layouts/client-storycard.module.css'

export type ClientCardProps = {
	data: Pick<
		Client,
		| 'name'
		| 'title'
		| 'link'
		| 'logo'
		| 'story'
		| 'excerpt'
		| 'featuredImage'
		| 'landscapeImage'
		| 'representationName'
		| 'representationPosition'
		| 'representationAvatar'
	>
} & HTMLAttributes<HTMLDivElement>

export function ClientCard({ data, ...props }: ClientCardProps) {
	const router = useRouter()

	return (
		<div
			{...props}
			className={cx(stylesClientCard.card, props.className)}
			onClick={(e) => {
				if (props.onClick) {
					props.onClick(e)
				} else {
					router.push(collectionLink(data.link))
				}
			}}
		>
			<div className={stylesClientCard.content}>
				<Link
					href={collectionLink(data.link)}
					className={stylesClientCard.logo}
				>
					<Image
						src={data.logo}
						width={80}
						height={80}
					/>
				</Link>
				<Title
					order={5}
					lineClamp={2}
					className={stylesClientCard.title}
				>
					<Link href={collectionLink(data.link)}>{data.name || data.title}</Link>
				</Title>
				{data.story || data.excerpt ? (
					<Text
						size="sm"
						lineClamp={8}
						className={stylesClientCard.story}
					>
						{data.story || data.excerpt}
					</Text>
				) : null}
				{data.representationName ? (
					<div className={stylesClientCard.author}>
						<figure className={stylesClientCard.avatar}>
							<Image
								src={data.representationAvatar}
								width={48}
								height={48}
							/>
						</figure>
						<div className={stylesClientCard.profile}>
							<Title
								order={6}
								className={stylesClientCard.name_profile}
							>
								{data.representationName}
							</Title>
							{data.representationPosition ? (
								<span className={stylesClientCard.position_profile}>
									{data.representationPosition}
								</span>
							) : null}
						</div>
					</div>
				) : null}
			</div>
			<Link
				href={collectionLink(data.link)}
				className={stylesClientCard.thumbnail}
			>
				<Image
					src={data.landscapeImage || data.featuredImage}
					width={585}
					height={585}
				/>
			</Link>
		</div>
	)
}

export function SkeletonClientCard(props: Partial<ClientCardProps>) {
	return (
		<div
			{...props}
			className={cx(stylesClientCard.card, props.className)}
		>
			<div className={stylesClientCard.content}>
				<Skeleton className={stylesClientCard.logo} />
				<Skeleton
					w="200px"
					maw="80%"
					h={25}
					className={stylesClientCard.title}
				/>
				<Stack
					mt="xs"
					gap={4}
					className={stylesClientCard.story}
				>
					<Skeleton
						w="80%"
						h={14}
					/>
					<Skeleton
						w="70%"
						h={14}
					/>
					<Skeleton
						w="75%"
						h={14}
					/>
					<Skeleton
						w="45%"
						h={14}
					/>
				</Stack>
				<div className={stylesClientCard.author}>
					<Skeleton className={stylesClientCard.avatar} />
					<div className={stylesClientCard.profile}>
						<Skeleton
							w={160}
							maw="80%"
							h={14}
							mt={6}
							className={stylesClientCard.name_profile}
						/>
						<Skeleton
							w={200}
							maw="90%"
							h={12}
							className={stylesClientCard.position_profile}
						/>
					</div>
				</div>
			</div>
			<Skeleton
				radius={0}
				className={stylesClientCard.thumbnail}
			/>
		</div>
	)
}

export type ClientLogoCardProps = {
	data: Pick<Client, 'name' | 'title' | 'link' | 'logo'>
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Card>

export function ClientLogoCard({ data, ...props }: ClientLogoCardProps) {
	const router = useRouter()

	return (
		<Card
			{...props}
			padding="lg"
			radius="lg"
			withBorder
			className={cx(stylesClientLogoCard.card, props.className)}
			onClick={(e) => {
				if (props.onClick) {
					props.onClick(e)
				} else {
					router.push(collectionLink(data.link))
				}
			}}
		>
			<Link
				href={collectionLink(data.link)}
				className={stylesClientLogoCard.thumbnail}
			>
				<Image
					src={data.logo}
					width={80}
					height={80}
				/>
			</Link>

			<Stack
				align="center"
				gap={4}
			>
				<Title
					order={5}
					className={stylesClientLogoCard.title}
				>
					<Link href={collectionLink(data.link)}>{data.name || data.title}</Link>
				</Title>
			</Stack>
		</Card>
	)
}

export function SkeletonClientLogoCard(props: Partial<ClientLogoCardProps>) {
	return (
		<Card
			{...props}
			padding="xl"
			radius="lg"
			withBorder
			className={cx(stylesClientLogoCard.card, props.className)}
		>
			<Skeleton className={stylesClientLogoCard.thumbnail} />

			<Stack
				align="center"
				gap={4}
			>
				<Skeleton
					w="65%"
					h={25}
					className={stylesClientLogoCard.title}
				/>
			</Stack>
		</Card>
	)
}

export type ClientStoryCardProps = {
	data: Pick<
		Client,
		| 'name'
		| 'link'
		| 'story'
		| 'representationName'
		| 'representationPosition'
		| 'representationAvatar'
	>
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Card>

export function ClientStoryCard({ data, ...props }: ClientStoryCardProps) {
	return (
		<Card
			{...props}
			padding="xl"
			radius="lg"
			withBorder
			className={cx(stylesClientStoryCard.card, props.className)}
		>
			<Quote className={stylesClientStoryCard.icon} />
			<Title
				order={5}
				lineClamp={2}
				className={stylesClientStoryCard.title}
			>
				<Link href={collectionLink(data.link)}>{data.name}</Link>
			</Title>
			<Text
				size="sm"
				lineClamp={6}
				className={stylesClientStoryCard.story}
			>
				{data.story}
			</Text>
			<div className={stylesClientStoryCard.author}>
				<Image
					src={data.representationAvatar}
					className={stylesClientStoryCard.avatar}
					width={40}
					height={40}
				/>
				<div className={stylesClientStoryCard.profile}>
					<span className={stylesClientStoryCard.name_profile}>
						{data.representationName}
					</span>
					<span className={stylesClientStoryCard.position_profile}>
						{data.representationPosition}
					</span>
				</div>
			</div>
		</Card>
	)
}

export function SkeletonClientStoryCard(props: Partial<ClientStoryCardProps>) {
	return (
		<Card
			{...props}
			padding="xl"
			radius="lg"
			withBorder
			className={cx(stylesClientLogoCard.card, props.className)}
		>
			<Skeleton className={stylesClientLogoCard.thumbnail} />

			<Stack
				align="center"
				gap={4}
			>
				<Skeleton
					w="65%"
					h={25}
					className={stylesClientLogoCard.title}
				/>
			</Stack>
		</Card>
	)
}
