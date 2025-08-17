import Banner from '$blocks/banner'
import ShowBlocks from '$blocks/show-blocks'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import type { SiteTemplateProps } from '$templates/site'

type Props = SiteTemplateProps & {
	collection: 'clients'
}

export default function ClientTemplate({ data, site }: Props) {
	return (
		<div className="site">
			<Banner block={data.banner} />
			<Header site={site} />
			<main className="site-main">
				<ShowBlocks block={data.content} />
			</main>
			<Footer site={site} />
		</div>
	)
}
