'use client'
import { Badge, Group, Text, ThemeIcon } from '@mantine/core'
import { ArrowUpRight } from 'lucide-react'
import { useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import { FadeContainer, FadeDiv } from '$components/Fade'
import Image from '$components/Image'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import { useBackgroundImage } from '$hooks/style'
import type { Actions as ActionsBlock, Banner as BannerBlock } from '$payload-types'
import { collectionLink } from '$utils/common'
import { colorVars, cx } from '$utils/styles'

import styles from '$styles/blocks/banner.module.css'

export type BannerProps = {
	block?: BannerBlock | Omit<BannerBlock, 'blockType'> | null
} & HTMLAttributes<HTMLDivElement>

export default function Banner({ block, ...props }: BannerProps) {
	const bgImage = useBackgroundImage(block?.backgroundImage)

	const align = useMemo(() => {
		return block?.align || 'center'
	}, [block])

	const backgroundColor = useMemo(() => {
		return {
			...block?.backgroundColor,
			base: block?.backgroundColor?.base || 'primary-soft',
		}
	}, [block])

	const actionItems = useMemo((): ActionsBlock['items'] => {
		return block?.actions?.map((action, index) => {
			if (index !== 0) {
				return {
					...action,
					variant: action.variant || 'light',
				}
			}

			return action
		})
	}, [block])

	if (!block || block.type === 'none') {
		return null
	}

	return (
		<section
			{...props}
			role="banner"
			data-slot="banner"
			data-align={align}
			className={cx(styles.banner, props.className)}
			style={{
				color: colorVars(block.textColor),
				['--bg-color' as string]: colorVars(backgroundColor),
			}}
		>
			<Image
				src={bgImage}
				width={1600}
				height={900}
				className={styles.image}
			/>
			<FadeContainer className="container">
				<FadeDiv className={styles.inner}>
					{block.featured?.value && typeof block.featured.value === 'object' ? (
						<Link
							href={collectionLink(block.featured?.value.link)}
							className={styles.featured_link}
						>
							<Badge
								variant="light"
								color="secondary"
							>
								{block.featured?.relationTo === 'clients' ? 'Warga2M' : 'Template'}
							</Badge>
							<Group gap="xs">
								<Text
									component="span"
									size="sm"
									c="var(--text-base-color)"
								>
									{block.featured?.value.title}
								</Text>
								<ThemeIcon
									variant="subtle"
									color="secondary"
									size="xs"
								>
									<ArrowUpRight />
								</ThemeIcon>
							</Group>
						</Link>
					) : null}
					<Richtext
						data={block.content}
						className={styles.content}
					/>
					<Actions
						block={{
							items: actionItems,
							align,
						}}
						className="mt-xl"
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}
