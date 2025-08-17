import type { JobPosting } from 'schema-dts'

import type { Team } from '$payload-types'
import { assetUrl } from '$utils/common'

export const vacancySchema = (team: Team): JobPosting => {
	return {
		'@type': 'JobPosting',
		name: team.title || 'Untitled',
		title: team.title || 'Untitled',
		description: team.meta?.description || team.excerpt || undefined,
		url: team.link || undefined,
		image: assetUrl(team.meta?.image || team.featuredImage),
		datePosted: team.updatedAt || undefined,
		directApply: true,
	}
}
