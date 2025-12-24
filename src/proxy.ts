import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { CollectionSlug } from 'payload'

import { slugReusable } from '$modules/vars'

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const response = NextResponse.next()
	const cookieStore = await cookies()
	const isLoggedIn = cookieStore.has('payload-token')

	if (!isLoggedIn) {
		if (pathname.startsWith(`/${slugReusable}`)) {
			return NextResponse.redirect(new URL('/404', request.url))
		}

		if (pathname.startsWith('/api')) {
			type CollectionSlugGuard = Exclude<
				CollectionSlug,
				| 'users'
				| 'asset'
				| 'payload-kv'
				| 'payload-locked-documents'
				| 'payload-preferences'
				| 'payload-migrations'
			>

			const excludeApiPath: CollectionSlugGuard[] = [
				'pages',
				'posts',
				'postCategories',
				'services',
				'templates',
				'teams',
				'teamPositions',
				'clients',
				'faqs',
				'reusables',
				'forms',
				'form-submissions',
			]

			const isExcluded = excludeApiPath.some((path) => pathname.startsWith(`/api/${path}`))

			if (isExcluded) {
				return NextResponse.redirect(new URL('/404', request.url))
			}
		}
	}

	if (
		pathname.startsWith('/api/media/') ||
		pathname.startsWith('/images/') ||
		pathname.startsWith('/templates/')
	) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
		response.headers.set('Vary', 'Accept')
	}

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!_next/static|_next/image|fonts|blocks|favicon.png|favicon.ico|sitemap.xml|robots.txt).*)',
	],
}
