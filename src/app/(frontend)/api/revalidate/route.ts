import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const schema = z.object({
	tags: z.array(z.string()).optional(), // ['global', 'global:{slug}', 'posts', 'posts:{slug}', 'sitemap']
	secret: z.string(),
})

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const searchParams = Object.fromEntries(url.searchParams.entries())

	try {
		const { secret, tags } = schema.parse(searchParams)

		if (secret && secret !== process.env.REVALIDATE_SECRET) {
			return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
		}

		const reTags = tags || ['global', 'collection', 'sitemap']

		await Promise.all(reTags.map((tag) => revalidateTag(tag)))

		return NextResponse.json({
			revalidated: true,
			tags: reTags,
		})
	} catch (error) {
		console.error('Error revalidating', { error })

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid query parameters', details: error },
				{ status: 400 },
			)
		}

		return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
	}
}
