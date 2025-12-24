import type { BreadcrumbList, ListItem } from 'schema-dts'

import { slugHomepage } from '$modules/vars'
import { slugPostType } from '$payload-libs/link-utils'
import type { Page } from '$payload-types'
import type { SeoDts } from '$seo/index'

export const breadcrumbSchema = ({ data, collection, site }: SeoDts): BreadcrumbList => {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

	const itemListElement = (): ListItem[] => {
		const listElements: ListItem[] = []

		if (collection === 'pages' && data.slug !== slugHomepage) {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: site?.title || 'Home',
				item: siteUrl,
			})
		}

		if (collection === 'posts') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: 'Blog Overview', // TODO: should match with page blog overview title
				item: `${siteUrl}/${slugPostType.posts}`,
			})

			if (data.category && typeof data.category === 'object') {
				listElements.push({
					'@type': 'ListItem',
					position: listElements.length + 1,
					name: data.category.title || 'Uncategorized',
					item: siteUrl + data.category.link!,
				})
			} else {
				listElements.push({
					'@type': 'ListItem',
					position: listElements.length + 1,
					name: 'Uncategorized',
				})
			}

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title || 'Untitled',
			})

			return listElements
		}

		if (collection === 'postCategories') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: 'Blog Overview', // TODO: should match with page blog overview title
				item: `${siteUrl}/${slugPostType.postCategories}`,
			})

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title || 'Untitled',
			})

			return listElements
		}

		if (collection === 'clients') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: 'Client Overview', // TODO: should match with page client overview title
				item: `${siteUrl}/${slugPostType.clients}`,
			})

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title || 'Untitled',
			})

			return listElements
		}

		if (collection === 'teams') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: 'Client Overview', // TODO: should match with page team overview title
				item: `${siteUrl}/${slugPostType.teams}`,
			})

			const positions = data.positions

			if (positions && positions.length && typeof positions[0] === 'object') {
				const position = positions[0]
				listElements.push({
					'@type': 'ListItem',
					position: listElements.length + 1,
					name: position.title || 'Uncategorized',
					item: siteUrl + position.link!,
				})
			} else {
				listElements.push({
					'@type': 'ListItem',
					position: listElements.length + 1,
					name: 'Uncategorized',
				})
			}

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title || 'Untitled',
			})

			return listElements
		}

		if (collection === 'teamPositions') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: 'Blog Overview', // TODO: should match with page blog overview title
				item: `${siteUrl}/${slugPostType.teamPositions}`,
			})

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title || 'Untitled',
			})

			return listElements
		}

		if (collection === 'templates') {
			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: 'Client Overview', // TODO: should match with template team overview title
				item: `${siteUrl}/${slugPostType.templates}`,
			})

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: data.title || 'Untitled',
			})

			return listElements
		}

		if (collection === 'pages' && data?.parentPage && typeof data.parentPage === 'object') {
			const parentPage = data.parentPage as Page

			if (parentPage?.parentPage && typeof parentPage.parentPage === 'object') {
				const parentPost2 = data.parentPage.parentPage as Page

				if (parentPost2?.parentPage && typeof parentPost2.parentPage === 'object') {
					const parentPost3 = parentPost2.parentPage as Page

					if (parentPost3?.parentPage && typeof parentPost3.parentPage === 'object') {
						const parentPost4 = parentPost3.parentPage as Page

						if (parentPost4?.parentPage && typeof parentPost4.parentPage === 'object') {
							const parentPost5 = parentPost4.parentPage as Page

							if (parentPost5) {
								listElements.push({
									'@type': 'ListItem',
									position: listElements.length + 1,
									name: parentPost5.title || 'Untitled',
									item: siteUrl + parentPost5.link!,
								})
							}
						}

						listElements.push({
							'@type': 'ListItem',
							position: listElements.length + 1,
							name: parentPost4.title || 'Untitled',
							item: siteUrl + parentPost4.link!,
						})
					}

					listElements.push({
						'@type': 'ListItem',
						position: listElements.length + 1,
						name: parentPost3.title || 'Untitled',
						item: `${siteUrl}/${parentPost3.link!}`,
					})
				}

				listElements.push({
					'@type': 'ListItem',
					position: listElements.length + 1,
					name: parentPost2.title || 'Untitled',
					item: siteUrl + parentPost2.link!,
				})
			}

			listElements.push({
				'@type': 'ListItem',
				position: listElements.length + 1,
				name: parentPage.title || 'Untitled',
				item: siteUrl + parentPage.link!,
			})
		}

		listElements.push({
			'@type': 'ListItem',
			position: listElements.length + 1,
			name: data.title || 'Untitled',
		})

		return listElements
	}

	return {
		'@type': 'BreadcrumbList',
		itemListElement: itemListElement(),
	}
}
