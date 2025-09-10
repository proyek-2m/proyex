'use client'
import {
	Burger,
	HoverCard,
	HoverCardDropdown,
	HoverCardTarget,
	Stack,
	Text,
	Transition,
} from '@mantine/core'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import Image from '$components/Image'
import Link from '$components/Link'
import { useIsMedia } from '$hooks/media-query'
import type { Actions as ActionsBlock, Site } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/header.module.css'

export type HeaderProps = {
	site: Site | null
} & HTMLAttributes<HTMLDivElement>

export default function Header({ site, ...props }: HeaderProps) {
	const compId = useId()
	const [openNav, { close: closeNav, toggle: toggleNav }] = useDisclosure()
	const mediaQuery = useIsMedia()
	const refNavMobile = useClickOutside(() => closeNav())

	const actionItems = useMemo((): ActionsBlock['items'] => {
		return site?.actions?.map((action, index) => ({
			...action,
			variant: action.variant || index === 0 ? 'light' : 'filled',
			size: action.size || 'sm',
			color: {
				...action.color,
				base: action.color?.base
					? action.color.base
					: index === 0
						? 'secondary'
						: 'primary',
			},
			rounded: {
				...action.rounded,
				base: action.rounded?.base || 'md',
			},
		}))
	}, [site])

	return (
		<header
			{...props}
			ref={refNavMobile}
			data-slot="header"
			className={cx(styles.header, props.className)}
		>
			<div className={styles.inner}>
				{/* Logo */}
				{site?.logo ? (
					<div className={styles.branding}>
						<Link
							href="/"
							aria-label="Home"
							className={styles.logo}
						>
							<span className="sr-only">{site?.title} Logo</span>
							<Image
								src={site.logo}
								width={48}
								height={48}
							/>
						</Link>
					</div>
				) : null}
				{/* Navigation Desktop */}
				{mediaQuery.desktop ? (
					<>
						{site?.navigation && site.navigation.length ? (
							<nav className={styles.navigation_desktop}>
								<ul className={styles.menu}>
									{site.navigation.map((navigation, index) => {
										if (navigation.submenu && navigation.submenu.length) {
											return (
												<HoverCard
													key={`nav-${compId}-${index}`}
													width={280}
													offset={10}
													withinPortal={false}
												>
													<HoverCardTarget>
														<li>
															<Link
																href={collectionLink(
																	navigation.link,
																)}
															>
																{navigation.label}
															</Link>
														</li>
													</HoverCardTarget>
													<HoverCardDropdown>
														<Stack
															gap="xs"
															p="md"
														>
															{navigation.submenu.map(
																(subNavigation, subIndex) => (
																	<Text
																		key={`nav-${compId}-${index}-${subIndex}`}
																		component={Link}
																		href={collectionLink(
																			subNavigation.link,
																		)}
																		size="sm"
																		fw={500}
																		className="hover:text-primary"
																	>
																		{subNavigation.label}
																	</Text>
																),
															)}
														</Stack>
													</HoverCardDropdown>
												</HoverCard>
											)
										}

										return (
											<li key={`nav-${compId}-${index}`}>
												<Link href={collectionLink(navigation.link)}>
													{navigation.label}
												</Link>
											</li>
										)
									})}
								</ul>
							</nav>
						) : null}
						{site?.actions && site.actions.length ? (
							<Actions
								block={{
									items: actionItems,
								}}
								className={styles.actions_desktop}
							/>
						) : null}
					</>
				) : null}

				{/* Hamburger */}
				{mediaQuery.belowDesktop ? (
					<Burger
						opened={openNav}
						onClick={toggleNav}
						size="md"
						color="secondary"
						aria-label={openNav ? 'Close Navigation Menu' : 'Open Navigation Menu'}
						className={styles.menu_action}
					/>
				) : null}

				<Transition mounted={mediaQuery.belowDesktop && openNav}>
					{(styleTransitions) => (
						<nav
							style={styleTransitions}
							className={styles.navigation_mobile}
						>
							{site?.navigation && site.navigation.length ? (
								<ul className={styles.menu}>
									{site.navigation.map((navigation, index) => (
										<li key={`nav-${compId}-${index}`}>
											<Link href={collectionLink(navigation.link)}>
												{navigation.label}
											</Link>
											{navigation.submenu && navigation.submenu.length ? (
												<Stack
													component="ul"
													pl="sm"
													gap={4}
												>
													{navigation.submenu.map(
														(subNavigation, subIndex) => (
															<li
																key={`nav-${compId}-${index}-${subIndex}`}
															>
																<Text
																	key={`nav-${compId}-${index}-${subIndex}`}
																	component={Link}
																	href={collectionLink(
																		subNavigation.link,
																	)}
																	size="sm"
																	fw={500}
																>
																	{subNavigation.label}
																</Text>
															</li>
														),
													)}
												</Stack>
											) : null}
										</li>
									))}
								</ul>
							) : null}
							{site?.actions && site.actions.length ? (
								<Actions
									block={{
										items: actionItems,
										direction: 'column',
									}}
									className={styles.actions_mobile}
								/>
							) : null}
						</nav>
					)}
				</Transition>
			</div>
		</header>
	)
}
