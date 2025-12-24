import type { Metadata } from 'next'
import Head from 'next/head'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import {
	slugClient,
	slugHomepage,
	slugPost,
	slugReusable,
	slugService,
	slugTeam,
	slugTemplates,
} from '$modules/vars'
import { generateMeta } from '$payload-libs/meta-utils'
import {
	getSiteGlobal,
	pageSitemap,
	serviceSitemap,
	templateSitemap,
} from '$payload-libs/server/repos'
import type { Client, Page, Post, PostCategory, Team, Template } from '$payload-types'
import { seoSchema } from '$seo/index'
import {
	clientLoader,
	pageLoader,
	postCategoryLoader,
	postLoader,
	reusableLoader,
	serviceLoader,
	teamLoader,
	teamPositionLoader,
	templateLoader,
} from '$server-functions/loader'
import SiteTemplate from '$templates/site'
import type { Queried } from '$type'

type Args = {
	params: Promise<{
		slug?: string[]
	}>
}

export const dynamic = 'force-static'
export const revalidate = 2592000
export const dynamicParams = true

export default async function Page({ params: paramsPromise }: Args) {
	const { isEnabled: draft } = await draftMode()
	const { slug } = await paramsPromise

	if (slug) {
		// Don't generate metadata for Admin routes, API routes and public files
		if (
			slug[0] === 'admin' ||
			slug[0] === '_next' ||
			slug[0] === 'lib' ||
			slug[0] === '.well-known' ||
			slug[0] === 'api' ||
			slug.join('/').includes('.')
		) {
			return redirect('/404')
		}

		if (slug[slug.length - 1] === slugHomepage) {
			return redirect('/404')
		}

		if (slug[0] === slugHomepage) {
			return redirect('/')
		}
	}

	const slugs = slug || [slugHomepage]

	let loader: Queried | null = null

	if (slugs[0] === slugPost) {
		if (slugs.length === 1) {
			const doc = await pageLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'pages',
				data: doc,
			}
		} else if (slugs.length === 2) {
			const doc = await postCategoryLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'postCategories',
				data: doc,
			}
		} else {
			const doc = await postLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'posts',
				data: doc,
			}
		}
	} else if (slugs[0] === slugTeam) {
		if (slugs.length === 1) {
			const doc = await pageLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'pages',
				data: doc,
			}
		} else if (slugs.length === 2) {
			const doc = await teamPositionLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'teamPositions',
				data: doc,
			}
		} else {
			const doc = await teamLoader(slugs)

			if (!doc) {
				return redirect('/404')
			}

			loader = {
				collection: 'teams',
				data: doc,
			}
		}
	} else if (slugs[0] === slugClient && slugs.length === 2) {
		const doc = await clientLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'clients',
			data: doc,
		}
	} else if (slugs[0] === slugService && slugs.length === 2) {
		const doc = await serviceLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'services',
			data: doc,
		}
	} else if (slugs[0] === slugTemplates && slugs.length === 2) {
		const doc = await templateLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'templates',
			data: doc,
		}
	} else if (slugs[0] === slugReusable && slugs.length === 2) {
		const doc = await reusableLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'reusables',
			data: doc,
		}
	} else {
		const doc = await pageLoader(slugs)

		if (!doc) {
			return redirect('/404')
		}

		loader = {
			collection: 'pages',
			data: doc,
		}
	}

	const siteConfig = await getSiteGlobal()

	return (
		<>
			{!draft ? (
				<>
					{siteConfig?.googleAnalytics ? (
						<>
							{/* <!-- Google tag (gtag.js) --> */}
							<script
								async
								src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalytics}`}
							/>
							<script id="google-analytics">
								{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){window.dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', '${siteConfig.googleAnalytics}');
						`}
							</script>
						</>
					) : null}
					{siteConfig?.googleTagManager ? (
						<>
							<Head>
								<script
									id="google-tag-manager"
									dangerouslySetInnerHTML={{
										__html: `
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','${siteConfig.googleTagManager}');
							`,
									}}
								/>
							</Head>
							{/* GTM noscript iframe (for users with JavaScript disabled) */}
							<noscript>
								<iframe
									src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.googleTagManager}`}
									height="0"
									width="0"
									style={{ display: 'none', visibility: 'hidden' }}
								></iframe>
							</noscript>
						</>
					) : null}
					{siteConfig?.metaPixelID ? (
						<Head>
							<script
								id="fb-pixel"
								dangerouslySetInnerHTML={{
									__html: `
						!function(f,b,e,v,n,t,s)
						{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
						n.callMethod.apply(n,arguments):n.queue.push(arguments)};
						if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
						n.queue=[];t=b.createElement(e);t.async=!0;
						t.src=v;s=b.getElementsByTagName(e)[0];
						s.parentNode.insertBefore(t,s)}(window, document,'script',
						'https://connect.facebook.net/en_US/fbevents.js');
						fbq('init', '${siteConfig.metaPixelID}');
						fbq('track', 'PageView');
						`,
								}}
							/>
							<noscript>
								<img
									height="1"
									width="1"
									style={{ display: 'none' }}
									src={`https://www.facebook.com/tr?id=${siteConfig.metaPixelID}&ev=PageView&noscript=1`}
								/>
							</noscript>
						</Head>
					) : null}
					{siteConfig?.tiktokPixelID ? (
						<Head>
							<script
								id="tiktok-pixel"
								dangerouslySetInnerHTML={{
									__html: `
								!function (w, d, t) {
								w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
								ttq.load('${siteConfig.tiktokPixelID}');
								ttq.page();
							}(window, document, 'ttq');
							`,
								}}
							/>
						</Head>
					) : null}
				</>
			) : null}
			<script
				id="proyex-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						seoSchema({
							...loader,
							site: siteConfig,
						}),
					),
				}}
			/>
			<SiteTemplate
				{...loader}
				site={siteConfig}
				draft={draft}
			/>
		</>
	)
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
	const { slug = [slugHomepage] } = await paramsPromise

	try {
		// Don't generate metadata for Admin routes, API routes and public files
		if (
			slug[0] === 'admin' ||
			slug[0] === '_next' ||
			slug[0] === 'lib' ||
			slug[0] === '.well-known' ||
			slug[0] === 'api' ||
			slug.join('/').includes('.')
		) {
			return {}
		}

		let doc: Page | Post | Team | Client | PostCategory | Template | null = null

		if (slug[0] === slugPost) {
			if (slug.length === 1) {
				doc = await pageLoader(slug)
			} else if (slug.length === 2) {
				doc = await postCategoryLoader(slug)
			} else {
				doc = await postLoader(slug)
			}
		} else if (slug[0] === slugTeam) {
			if (slug.length === 1) {
				doc = await pageLoader(slug)
			} else if (slug.length === 2) {
				doc = await teamPositionLoader(slug)
			} else {
				doc = await teamLoader(slug)
			}
		} else if (slug[0] === slugClient && slug.length === 2) {
			doc = await clientLoader(slug)
		} else if (slug[0] === slugService && slug.length === 2) {
			doc = await serviceLoader(slug)
		} else if (slug[0] === slugTemplates && slug.length === 2) {
			doc = await templateLoader(slug)
		} else if (slug[0] === slugReusable && slug.length === 2) {
			doc = await reusableLoader(slug)
		} else {
			doc = await pageLoader(slug)
		}

		if (!doc) {
			return {}
		}

		const siteConfig = await getSiteGlobal()

		if (!siteConfig) {
			return {}
		}

		return generateMeta(doc, siteConfig)
	} catch (error) {
		console.error('generateMetadata', { slug, error })

		return {}
	}
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === 'development') return []

	const [pages, templates, services] = await Promise.all([
		pageSitemap(),
		templateSitemap(),
		serviceSitemap(),
	])

	return [...pages, ...templates, ...services].map((doc) => {
		if (doc.link) {
			const slugs = doc.link.split('/').filter(Boolean)

			return {
				slug: slugs.length ? slugs : [slugHomepage],
			}
		}

		return {
			slug: [doc.slug],
		}
	})
}
