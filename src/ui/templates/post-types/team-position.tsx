import Banner from '$blocks/banner'
import ListingTeam from '$blocks/listing-team/server'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import type { SiteTemplateProps } from '$templates/site'

type Props = SiteTemplateProps & {
	collection: 'teamPositions'
}

export default function TeamPositionTemplate({ data, site }: Props) {
	return (
		<div className="site">
			<Banner block={data.banner} />
			<Header site={site} />
			<main className="site-main">
				<ListingTeam
					block={{
						type: 'selectedPositions',
						selectedPositions: [data.id],
						showFilter: true,
						pagination: 'paged',
					}}
					withContainer
					className="pt-7 pb-20 md:pb-40"
				/>
			</main>
			<Footer site={site} />
		</div>
	)
}
