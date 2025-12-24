import type { HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import Button from '$blocks/button'
import CardForm from '$blocks/card-form'
import ClientStory from '$blocks/client-story'
import ClientStorySlider from '$blocks/client-story-slider/server'
import CollapsibleTab from '$blocks/collapsible-tab'
import ContentCards from '$blocks/content-cards'
import ContentCtaCard from '$blocks/content-cta-card'
import ContentIconGrid from '$blocks/content-icon-grid'
import ContentMedia from '$blocks/content-media'
import ContentMediaCard from '$blocks/content-media-card'
import Divider from '$blocks/divider'
import FeaturedListingClient from '$blocks/featured-listing-client/server'
import Gallery from '$blocks/gallery'
import HeadingListing from '$blocks/heading-listing'
import InsightDisplay from '$blocks/insight-display'
import ListingClient from '$blocks/listing-client/server'
import ListingFaq from '$blocks/listing-faq/server'
import ListingPostCategory from '$blocks/listing-post-category/server'
import ListingPost from '$blocks/listing-post/server'
import ListingProduct from '$blocks/listing-product/server'
import Media from '$blocks/media'
import ShowReusable from '$blocks/show-reusable'
import SocialMap from '$blocks/social-map'
import Solutions from '$blocks/solutions'
import Spacing from '$blocks/spacing'
import Usp from '$blocks/usp'
import type { Config, Site } from '$payload-types'
import type { Queried } from '$type'

export type ShowBlocksProps = HTMLAttributes<HTMLDivElement> & {
	block?: Config['blocks'][keyof Config['blocks']][] | null
	site?: Site | null
	queried?: Queried
	withContainer?: boolean
}

export default function ShowBlocks({
	block,
	queried,
	withContainer = true,
	...props
}: ShowBlocksProps) {
	if (!block) {
		return null
	}

	return block.map((block, index) => {
		const keyComp = `${block.blockType}-${block.id || index}`

		if (block.blockType === 'actions') {
			return (
				<Actions
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'baseContent') {
			return (
				<BaseContent
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'button') {
			return (
				<Button
					key={keyComp}
					block={block}
				/>
			)
		}

		if (block.blockType === 'cardForm') {
			return (
				<CardForm
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'clientStory') {
			return (
				<ClientStory
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'clientStorySlider') {
			return (
				<ClientStorySlider
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'collapsibleTab') {
			return (
				<CollapsibleTab
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'contentCards') {
			return (
				<ContentCards
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'contentCtaCard') {
			return (
				<ContentCtaCard
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'contentIconGrid') {
			return (
				<ContentIconGrid
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'contentMedia') {
			return (
				<ContentMedia
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'contentMediaCard') {
			return (
				<ContentMediaCard
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'divider') {
			return (
				<Divider
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'gallery') {
			return (
				<Gallery
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'featuredListingClient') {
			return (
				<FeaturedListingClient
					key={keyComp}
					block={block}
					withContainer={withContainer}
					queried={queried?.collection === 'clients' ? queried.data : undefined}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingListing') {
			return (
				<HeadingListing
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'insightDisplay') {
			return (
				<InsightDisplay
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingClient') {
			return (
				<ListingClient
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingFaq') {
			return (
				<ListingFaq
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingPost') {
			return (
				<ListingPost
					key={keyComp}
					block={block}
					withContainer={withContainer}
					queried={queried?.collection === 'posts' ? queried.data : undefined}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingPostCategory') {
			return (
				<ListingPostCategory
					key={keyComp}
					block={block}
					withContainer={withContainer}
					queried={queried?.collection === 'postCategories' ? queried.data : undefined}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingProduct') {
			return (
				<ListingProduct
					key={keyComp}
					block={block}
					withContainer={withContainer}
					queried={queried?.collection === 'products' ? queried.data : undefined}
					{...props}
				/>
			)
		}

		if (block.blockType === 'media') {
			return (
				<Media
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'showReusable') {
			return (
				<ShowReusable
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'spacing') {
			return (
				<Spacing
					key={keyComp}
					block={block}
					{...props}
				/>
			)
		}

		if (block.blockType === 'solutions') {
			return (
				<Solutions
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'socialMap') {
			return (
				<SocialMap
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'usp') {
			return (
				<Usp
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		return <pre key={keyComp}>{block.blockType}</pre>
	})
}
