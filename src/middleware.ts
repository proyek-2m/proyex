import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { slugReusable } from '$modules/vars'

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const response = NextResponse.next()
	const cookieStore = await cookies()
	const isLoggedIn = cookieStore.has('payload-token')

	// Redirect to 404 when visitor not loggedin and trying to access /uploads
	if (pathname.startsWith('/uploads')) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL('/404', request.url))
		}
	}

	if (pathname.startsWith(`/${slugReusable}`) && !isLoggedIn) {
		return NextResponse.redirect(new URL('/404', request.url))
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
		'/((?!api|_next/static|_next/image|fonts|blocks|favicon.png|favicon.ico|sitemap.xml|robots.txt).*)',
	],
}
