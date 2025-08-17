import { SimpleGrid } from '@mantine/core'
import { useId, useMemo, type HTMLAttributes } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Icon from '$components/Icon'
import Image from '$components/Image'
import Link from '$components/Link'
import type { SocialMap as SocialMapBlock } from '$payload-types'
import { colorVars, cx, radiusVars } from '$utils/styles'

import styles from '$styles/blocks/social-map.module.css'

export type SocialMapProps = {
	block: SocialMapBlock | Omit<SocialMapBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function SocialMap({ block, withContainer, ...props }: SocialMapProps) {
	if (!withContainer) {
		return (
			<SocialMapInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="social-map"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<SocialMapInner block={block} />
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function SocialMapInner({ block, ...props }: Omit<SocialMapProps, 'withContainer'>) {
	const compId = useId()

	const rounded = useMemo(() => {
		return {
			...block?.rounded,
			base: block?.rounded?.base || 'xl',
		}
	}, [block.rounded])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '28px',
			vertical: block.gap?.vertical || block.gap?.base || '28px',
		}
	}, [block.gap])

	const iconColor = useMemo(() => {
		return {
			...block.iconColor,
			base: block.iconColor?.base || 'primary',
		}
	}, [block.iconColor])

	const socialRounded = useMemo(() => {
		return {
			...block.socialRounded,
			base: block.socialRounded?.base || 'lg',
		}
	}, [block.socialRounded])

	return (
		<div
			{...props}
			data-slot="social-map-inner"
			data-position={block.position || 'bottom'}
			className={cx(styles.social_map, props.className)}
		>
			{block.gmapSource ? (
				<iframe
					src={block.gmapSource}
					className={styles.gmap}
					referrerPolicy="no-referrer-when-downgrade"
					loading="lazy"
					allowFullScreen
					style={{
						borderRadius: radiusVars(rounded),
					}}
				/>
			) : (
				<Image
					src={null}
					width={1170}
					height={658}
					className={styles.gmap}
					style={{
						borderRadius: radiusVars(rounded),
					}}
				/>
			)}

			{block.items && block.items.length ? (
				<SimpleGrid
					cols={{
						base: 1,
						md: block.column || 3,
					}}
					spacing={{
						base: 'sm',
						md: gap.base,
					}}
					verticalSpacing={{
						base: 'sm',
						md: gap.vertical,
					}}
					className={styles.socials}
				>
					{block.items.map((item, index) => (
						<div
							key={`${compId}-${index}`}
							className={styles.social_card}
							style={{
								borderRadius: radiusVars(socialRounded),
							}}
						>
							<SocialCardInner data={item}>
								<div className={styles.heading_social}>
									<div
										className={styles.icon}
										style={{
											color: colorVars(iconColor),
										}}
									>
										<Icon name={item.icon || 'badge-question-mark'} />
									</div>
									<span className={styles.title}>
										{item.title || `Social ${index + 1}`}
									</span>
								</div>

								{item.label ? (
									<span className={styles.label}>{item.label}</span>
								) : null}
							</SocialCardInner>
						</div>
					))}
				</SimpleGrid>
			) : null}
		</div>
	)
}

function SocialCardInner({
	data,
	children,
	...props
}: {
	data: NonNullable<SocialMapBlock['items']>[number]
} & HTMLAttributes<HTMLDivElement | HTMLAnchorElement>) {
	if (data.link) {
		return (
			<Link
				{...props}
				href={data.link}
				target="_blank"
			>
				{children}
			</Link>
		)
	}

	return <div {...props}>{children}</div>
}
