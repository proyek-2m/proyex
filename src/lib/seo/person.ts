import type { Person } from 'schema-dts'

import type { Team } from '$payload-types'
import { assetUrl } from '$utils/common'

export const personSchema = (team: Team): Person => {
	return {
		'@type': 'Person',
		name: team.title || 'Unknown',
		description: team.meta?.description || team.excerpt || undefined,
		url: team.link || undefined,
		image: assetUrl(team.featuredImage),
		jobTitle: team.positions
			?.filter((position) => typeof position === 'object')
			.map((position) => position.title)
			.join(', '),
	}
}
