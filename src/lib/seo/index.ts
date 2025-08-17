import type { Graph, Thing } from 'schema-dts'

import { slugHomepage, slugPost } from '$modules/vars'
import type { Site } from '$payload-types'
import { blogSchema } from '$seo/blog'
import { blogPostingSchema } from '$seo/blog-post'
import { breadcrumbSchema } from '$seo/breadcrumb'
import { localBusinessSchema } from '$seo/local-business'
import { organizationSchema } from '$seo/organization'
import { pageSchema } from '$seo/page'
import { personSchema } from '$seo/person'
import type { Queried } from '$type'

export type SeoDts = {
	site: Site | null
} & Queried

export const seoSchema = ({ data, collection, site }: SeoDts): Graph => {
	const graph: Thing[] = []

	if (site) {
		if (collection === 'pages' && data.slug === slugHomepage) {
			graph.push(organizationSchema(site))
			graph.push(localBusinessSchema(site))
		} else {
			graph.push(breadcrumbSchema({ data, collection, site } as SeoDts))
		}
	}

	if (collection === 'posts') {
		graph.push(blogPostingSchema(data))
	} else if (collection === 'pages' && data.slug === slugPost) {
		graph.push(blogSchema(data))
	} else {
		graph.push(pageSchema(data))
	}

	if (collection === 'teams') {
		graph.push(personSchema(data))
	}

	return {
		'@context': 'https://schema.org',
		'@graph': graph,
	}
}
