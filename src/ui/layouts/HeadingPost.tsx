'use client'
import { Button, Group, Title } from '@mantine/core'
import type { SerializedEditorState } from 'lexical'
import { Clock } from 'lucide-react'
import { useMemo, type HTMLAttributes } from 'react'

import Link from '$components/Link'
import type { Post } from '$payload-types'
import { collectionLink } from '$utils/common'
import { readingTime } from '$utils/post'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/heading-post.module.css'

type Props = {
	data: Post
} & HTMLAttributes<HTMLDivElement>

export default function HeadingPost({ data, className, ...props }: Props) {
	const contents = useMemo(() => {
		const _contents: SerializedEditorState[] = []

		data.content?.forEach((item) => {
			if (item.blockType === 'baseContent' && item.content) {
				_contents.push(item.content)
			} else if (item.blockType === 'contentMedia' && item.content?.content) {
				_contents.push(item.content.content)
			} else if (item.blockType === 'contentMediaCard' && item.content?.content) {
				_contents.push(item.content.content)
			}
		})

		return _contents
	}, [data])

	return (
		<div
			{...props}
			className={cx(styles.heading, className)}
		>
			<Title mb="xs">{data.title}</Title>
			<Group
				gap="xs"
				mb="xl"
			>
				{data.category && typeof data.category === 'object' ? (
					<Button
						component={Link}
						href={collectionLink(data.category.link)}
						size="sm"
						variant="light"
						color="secondary"
						className={styles.category}
					>
						{data.category.title}
					</Button>
				) : null}
				<Button
					size="compact-sm"
					component="span"
					variant="subtle"
					leftSection={
						<Clock
							size="1rem"
							className="-mr-1"
						/>
					}
				>
					{readingTime(contents)} menit
				</Button>
			</Group>
		</div>
	)
}
