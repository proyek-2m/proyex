import type { Site } from '$payload-types'

import AdminBar from '$layouts/AdminBar'
import ClientTemplate from '$templates/post-types/client'
import PageTemplate from '$templates/post-types/page'
import PostTemplate from '$templates/post-types/post'
import PostCategoryTemplate from '$templates/post-types/post-category'
import ProductTemplate from '$templates/post-types/product'
import ReusableTemplate from '$templates/post-types/reusable'
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
			) : props.collection === 'products' ? (
				<ProductTemplate {...props} />
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
