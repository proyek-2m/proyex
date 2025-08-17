'use client'
import { Stack, Text } from '@mantine/core'
import { useMemo, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Image from '$components/Image'
import Link from '$components/Link'
import { useBackgroundImage } from '$hooks/style'
import type { ClientStory as ClientStoryBlock } from '$payload-types'
import { collectionLink } from '$utils/common'
import { colorVars, cx, paddingVars, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/client-story.module.css'

export type ClientStoryProps = {
	block: ClientStoryBlock | Omit<ClientStoryBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function ClientStory({ block, withContainer, ...props }: ClientStoryProps) {
	if (!withContainer) {
		return (
			<ClientStoryInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="client-story"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ClientStoryInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ClientStoryInner({ block, ...props }: Omit<ClientStoryProps, 'withContainer'>) {
	const bgImage = useBackgroundImage(block?.backgroundImage)

	const client = useMemo(() => {
		if (typeof block.client === 'object') {
			return block.client
		}

		return null
	}, [block.client])

	const landscapeImage = useMemo(() => {
		if (client?.landscapeImage) {
			return client?.landscapeImage
		}

		return bgImage
	}, [client, bgImage])

	const backgroundColor = useMemo(() => {
		return {
			...block.backgroundColor,
			base: block.backgroundColor?.base || 'primary-soft',
		}
	}, [block.backgroundColor])

	const rounded = useMemo(() => {
		return {
			...block?.rounded,
			base: block?.rounded?.base || 'xl',
		}
	}, [block])

	return (
		<div
			{...props}
			data-slot="client-story-inner"
			className={cx('relative', props.className)}
		>
			<Image
				src={landscapeImage}
				width={4}
				height={3}
				className={styles.background_image}
			/>
			<div
				className={styles.wrapper}
				style={{
					borderRadius: radiusVars(rounded),
					color: colorVars(block.textColor),
					['--bg-color' as string]: colorVars(backgroundColor),
				}}
			>
				<Image
					src={landscapeImage}
					width={1170}
					height={658}
					className={styles.foreground_image}
				/>
				<div
					className={styles.inner}
					style={{
						...paddingVars(block?.padding),
					}}
				>
					<blockquote className={styles.story}>{client?.story}</blockquote>
					<div className={styles.client}>
						<Image
							src={client?.representationAvatar}
							width={56}
							height={56}
							className={styles.avatar}
						/>
						<Stack gap={0}>
							{client?.representationName ? (
								<Text
									component="span"
									fw={600}
								>
									{client.representationName}
								</Text>
							) : null}
							{client?.name ? (
								<Text
									component={Link}
									href={collectionLink(client.link)}
									c="primary"
									size="sm"
								>
									{client.name}
								</Text>
							) : null}
						</Stack>
					</div>
				</div>
			</div>
		</div>
	)
}
