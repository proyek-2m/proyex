import { Stack, Title } from '@mantine/core'

import ListingPost from '$blocks/listing-post/server'
import ShowBlocks from '$blocks/show-blocks'
import { FadeContainer, FadeDiv } from '$components/Fade'
import Image from '$components/Image'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import HeadingPost from '$layouts/HeadingPost'
import SidebarPost from '$layouts/SidebarPost'
import type { SiteTemplateProps } from '$templates/site'
import { cx } from '$utils/styles'

import styles from '$styles/templates/post.module.css'

type Props = SiteTemplateProps & {
	collection: 'posts'
}

export default function PostTemplate({ data, site }: Props) {
	return (
		<div className="site">
			<Header site={site} />
			<main className={cx('site-main', styles.main)}>
				<FadeContainer className="container">
					<Image
						src={data.featuredImage}
						width={1170}
						height={660}
						className={styles.featuredImage}
					/>
					<article className={styles.article}>
						<SidebarPost
							data={data}
							className={styles.sidebar}
						/>
						<FadeDiv className={styles.content}>
							<HeadingPost data={data} />

							<ShowBlocks
								block={data.content}
								withContainer={false}
							/>
						</FadeDiv>
					</article>

					{data.category ? (
						<Stack
							mt={{
								base: '48px',
								md: '80px',
							}}
						>
							<Title
								order={3}
								mb={{
									base: 'md',
									md: 'lg',
								}}
							>
								Artikel terkait
							</Title>
							<ListingPost
								block={{
									type: 'selectedCategories',
									selectedCategories: [
										typeof data.category === 'number'
											? data.category
											: data.category.id,
									],
									total: 3,
								}}
								queried={data}
							/>
						</Stack>
					) : null}
				</FadeContainer>
			</main>
			<Footer site={site} />
		</div>
	)
}
