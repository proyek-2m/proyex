'use client'
import { ActionIcon } from '@mantine/core'
import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Mail,
	Music2,
	Phone,
	Twitter,
	Youtube,
} from 'lucide-react'
import { useId, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import type { Site } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()

export type FooterProps = {
	site: Site | null
} & HTMLAttributes<HTMLDivElement>

export default function Footer({ site, ...props }: FooterProps) {
	const compId = useId()

	return (
		<footer
			{...props}
			data-slot="footer"
			className={cx(styles.footer, props.className)}
		>
			<FooterPattern />

			<div className={styles.branding}>
				{site?.logo ? (
					<Link
						href="/"
						className={styles.logo}
					>
						<Image
							src={site.logo}
							width={60}
							height={60}
						/>
						<span className="sr-only">{site.title} Logo</span>
					</Link>
				) : null}

				{site?.footerDescription ? (
					<Richtext
						data={site.footerDescription}
						className={styles.desc}
					/>
				) : null}

				<div className={styles.colophon}>
					<div className={styles.socials}>
						{site?.socials?.email ? (
							<ActionIcon
								variant="subtle"
								component={Link}
								href={`mailto:${site.socials.email}`}
								target="_blank"
							>
								<Mail size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.telephone ? (
							<ActionIcon
								variant="subtle"
								component={Link}
								href={`tel:${site.socials.telephone}`}
								target="_blank"
							>
								<Phone size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.instagram ? (
							<ActionIcon
								variant="subtle"
								radius="sm"
								size="lg"
								component={Link}
								href={site.socials.instagram}
								target="_blank"
							>
								<Instagram size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.linkedin ? (
							<ActionIcon
								variant="subtle"
								radius="sm"
								size="lg"
								component={Link}
								href={site.socials.linkedin}
								target="_blank"
							>
								<Linkedin size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.facebook ? (
							<ActionIcon
								variant="subtle"
								radius="sm"
								size="lg"
								component={Link}
								href={site.socials.facebook}
								target="_blank"
							>
								<Facebook size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.tiktok ? (
							<ActionIcon
								variant="subtle"
								radius="sm"
								size="lg"
								component={Link}
								href={site.socials.tiktok}
								target="_blank"
							>
								<Music2 size={20} />
							</ActionIcon>
						) : null}
						{site?.socials?.twitter ? (
							<ActionIcon
								variant="subtle"
								radius="sm"
								size="lg"
								component={Link}
								href={site.socials.twitter}
								target="_blank"
							>
								<Twitter size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.youtube ? (
							<ActionIcon
								variant="subtle"
								radius="sm"
								size="lg"
								component={Link}
								href={site.socials.youtube}
								target="_blank"
							>
								<Youtube size={22} />
							</ActionIcon>
						) : null}
						{site?.socials?.github ? (
							<ActionIcon
								variant="subtle"
								component={Link}
								href={site.socials.github}
								target="_blank"
							>
								<Github size={22} />
							</ActionIcon>
						) : null}
					</div>
					<div className={styles.copyright}>
						&copy; {CURRENT_YEAR} {site?.title}
					</div>
				</div>
			</div>

			{/* Footer Sections */}
			{site?.footerNavigations?.map((navigation, indexNav) => (
				<div
					key={`${compId}-${indexNav}`}
					className={styles.navigation}
				>
					<h6 className={styles.title_nav}>{navigation.title}</h6>
					<ul className={styles.menu_nav}>
						{navigation.links?.map((menu, indexMenu) => (
							<li key={`${compId}-${indexNav}-${indexMenu}`}>
								<Link href={collectionLink(menu.link)}>{menu.label}</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</footer>
	)
}

function FooterPattern() {
	const compId = useId()

	return (
		<>
			<div className="pointer-events-none inset-0">
				{/* Left */}
				<div
					className="absolute inset-y-0 my-[-5rem] w-px"
					style={{
						maskImage: 'linear-gradient(transparent, white 5rem)',
					}}
				>
					<svg
						className="size-full"
						preserveAspectRatio="none"
					>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="100%"
							className="stroke-gray-300"
							strokeWidth="2"
							strokeDasharray="3 3"
						/>
					</svg>
				</div>

				{/* Right */}
				<div
					className="absolute inset-y-0 right-0 my-[-5rem] w-px"
					style={{
						maskImage: 'linear-gradient(transparent, white 5rem)',
					}}
				>
					<svg
						className="size-full"
						preserveAspectRatio="none"
					>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="100%"
							className="stroke-gray-300"
							strokeWidth="2"
							strokeDasharray="3 3"
						/>
					</svg>
				</div>
			</div>
			<svg className="mb-10 h-20 w-full border-y border-dashed border-gray-300 stroke-gray-300">
				<defs>
					<pattern
						id={`diagonal-footer-pattern-${compId}`}
						patternUnits="userSpaceOnUse"
						width="64"
						height="64"
					>
						{Array.from({ length: 17 }, (_, i) => {
							const offset = i * 8
							return (
								<path
									key={i}
									d={`M${-106 + offset} 110L${22 + offset} -18`}
									stroke=""
									strokeWidth="1"
								/>
							)
						})}
					</pattern>
				</defs>
				<rect
					stroke="none"
					width="100%"
					height="100%"
					fill={`url(#diagonal-footer-pattern-${compId})`}
				/>
			</svg>
		</>
	)
}
