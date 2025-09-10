import type { Site } from '$payload-types'

import AdminBar from '$layouts/AdminBar'
import ClientTemplate from '$templates/post-types/client'
import PageTemplate from '$templates/post-types/page'
import PostTemplate from '$templates/post-types/post'
import PostCategoryTemplate from '$templates/post-types/post-category'
import ReusableTemplate from '$templates/post-types/reusable'
import ServiceTemplate from '$templates/post-types/service'
import TeamTemplate from '$templates/post-types/team'
import TeamPositionTemplate from '$templates/post-types/team-position'
import ProjectTemplate from '$templates/post-types/template'
import LivePreviewListener from '$templates/preview'
import type { Queried } from '$type'

export type SiteTemplateProps = {
	site: Site | null
	draft?: boolean
} & Queried

export default function SiteTemplate({ draft, ...props }: SiteTemplateProps) {
	return (
		<>
			{draft ? <LivePreviewListener /> : null}
			{props.collection === 'posts' ? (
				<PostTemplate {...props} />
			) : props.collection === 'postCategories' ? (
				<PostCategoryTemplate {...props} />
			) : props.collection === 'pages' ? (
				<PageTemplate {...props} />
			) : props.collection === 'clients' ? (
				<ClientTemplate {...props} />
			) : props.collection === 'teams' ? (
				<TeamTemplate {...props} />
			) : props.collection === 'teamPositions' ? (
				<TeamPositionTemplate {...props} />
			) : props.collection === 'templates' ? (
				<ProjectTemplate {...props} />
			) : props.collection === 'services' ? (
				<ServiceTemplate {...props} />
			) : props.collection === 'reusables' ? (
				<ReusableTemplate {...props} />
			) : null}
			<AdminBar
				data={props.data}
				collection={props.collection}
			/>
		</>
	)
}
