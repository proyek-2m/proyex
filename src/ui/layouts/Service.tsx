'use client'
import { Button, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { ArrowUpRight } from 'lucide-react'
import { type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import { useRouter } from '$hooks/use-router'
import type { Service } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import stylesServiceGrid from '$styles/layouts/service-grid.module.css'

export type ServiceGridProps = {
	data: Pick<Service, 'title' | 'link' | 'excerpt' | 'featuredImage'>
} & HTMLAttributes<HTMLDivElement>

export function ServiceGrid({ data, ...props }: ServiceGridProps) {
	const router = useRouter()

	return (
		<div
			{...props}
			className={cx(stylesServiceGrid.grid, props.className)}
			onClick={(e) => {
				if (props.onClick) {
					props.onClick(e)
				} else {
					router.push(collectionLink(data.link))
				}
			}}
		>
			<Title
				order={5}
				mb="sm"
				className={stylesServiceGrid.title}
			>
				{data.title}
			</Title>
			<Image
				src={data.featuredImage}
				width={364}
				height={244}
				className={stylesServiceGrid.thumbnail}
			/>

			{data.excerpt ? (
				<Text
					size="sm"
					c="dimmed"
					mt="md"
					lineClamp={6}
				>
					{data.excerpt}
				</Text>
			) : null}

			<Group
				justify="flex-end"
				mt="auto"
				pt="lg"
			>
				<Button
					component={Link}
					href={collectionLink(data.link)}
					variant="outline"
					rightSection={<ArrowUpRight />}
				>
					Baca selengkapnya
				</Button>
			</Group>
		</div>
	)
}

export function SkeletonServiceGrid(props: Partial<ServiceGridProps>) {
	return (
		<div
			{...props}
			className={cx(stylesServiceGrid.grid, props.className)}
		>
			<Skeleton
				w="65%"
				h={25}
				mb="sm"
				className={stylesServiceGrid.title}
			/>
			<Skeleton className={stylesServiceGrid.thumbnail} />

			<Stack
				w="100%"
				gap={4}
				mt="md"
			>
				<Skeleton
					width="85%"
					height={18}
				/>
				<Skeleton
					width="80%"
					height={18}
				/>
				<Skeleton
					width="90%"
					height={18}
				/>
				<Skeleton
					width="60%"
					height={18}
				/>
			</Stack>
			<Group
				justify="flex-end"
				mt="auto"
				pt="lg"
			>
				<Skeleton
					width={162}
					maw="80%"
					height={36}
				/>
			</Group>
		</div>
	)
}
