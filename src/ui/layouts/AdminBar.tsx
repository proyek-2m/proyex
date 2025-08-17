'use client'
import { Button, Group, Menu } from '@mantine/core'
import { Database, FileText, LayoutGrid, UserRound } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import Link from '$components/Link'
import { useIsMedia } from '$hooks/media-query'
import type { User } from '$payload-types'
import type { SiteTemplateProps } from '$templates/site'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/admin-bar.module.css'

export type AdminBarProps = {
	authUser: User | null
} & Pick<SiteTemplateProps, 'data' | 'collection'> &
	HTMLAttributes<HTMLDivElement>

export default function AdminBar({ authUser, data, collection, ...props }: AdminBarProps) {
	const isMedia = useIsMedia()

	if (!isMedia.desktop || !authUser) {
		return null
	}

	return (
		<div
			{...props}
			className={cx(styles.admin_bar, props.className)}
		>
			<Group
				justify="center"
				gap={10}
				className="container"
			>
				<Menu
					shadow="md"
					withinPortal={false}
				>
					<Menu.Target>
						<Button
							variant="light"
							color="black"
							fz="sm"
							leftSection={
								<LayoutGrid
									size="1rem"
									className="mt-0.5 -mr-1"
								/>
							}
						>
							Dashboard
						</Button>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Label>Dashboard</Menu.Label>
						<Menu.Item
							component={Link}
							href="/admin"
							target="_blank"
						>
							Admin
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/globals/site"
							target="_blank"
						>
							Customize
						</Menu.Item>
						<Menu.Label>Form</Menu.Label>
						<Menu.Item
							component={Link}
							href="/admin/collections/form-submissions"
							target="_blank"
						>
							Submissions
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				<Menu
					shadow="md"
					withinPortal={false}
				>
					<Menu.Target>
						<Button
							variant="light"
							color="black"
							fz="sm"
							leftSection={
								<Database
									size="1rem"
									className="mt-0.5 -mr-1"
								/>
							}
						>
							Collections
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Archieve</Menu.Label>
						<Menu.Item
							component={Link}
							href="/admin/collections/clients"
							target="_blank"
						>
							Clients
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/teams"
							target="_blank"
						>
							Teams
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/teamPositions"
							target="_blank"
						>
							Team Positions
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/templates"
							target="_blank"
						>
							Templates
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/pages"
							target="_blank"
						>
							Pages
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/posts"
							target="_blank"
						>
							Posts
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/postCategories"
							target="_blank"
						>
							Post Categories
						</Menu.Item>
						<Menu.Label>Static</Menu.Label>
						<Menu.Item
							component={Link}
							href="/admin/collections/faqs"
							target="_blank"
						>
							Faqs
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/collections/reusables"
							target="_blank"
						>
							Reusables
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				<Menu
					shadow="md"
					withinPortal={false}
				>
					<Menu.Target>
						<Button
							variant="light"
							color="black"
							fz="sm"
							leftSection={
								<FileText
									size="1rem"
									className="mt-0.5 -mr-1"
								/>
							}
						>
							Data
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>{data.title}</Menu.Label>
						<Menu.Item
							component={Link}
							href={`/admin/collections/${collection}/${data.id}`}
							target="_blank"
						>
							Edit
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				<Menu
					shadow="md"
					withinPortal={false}
				>
					<Menu.Target>
						<Button
							variant="light"
							color="black"
							fz="sm"
							leftSection={
								<UserRound
									size="1rem"
									className="mt-0.5 -mr-1"
								/>
							}
						>
							Account
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>{authUser.email}</Menu.Label>
						<Menu.Item
							component={Link}
							href="/admin/account"
							target="_blank"
						>
							Profile
						</Menu.Item>
						<Menu.Item
							component={Link}
							href="/admin/logout"
							target="_blank"
							color="red"
						>
							Logout
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</div>
	)
}
