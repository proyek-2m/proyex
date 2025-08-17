import configPromise from '$payload-config'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	if (!id) {
		return new NextResponse('Asset not found', { status: 404 })
	}

	const payload = await getPayload({ config: configPromise })

	const imagePayload = await payload.findByID({
		collection: 'asset',
		id,
	})

	if (!imagePayload.url) {
		return new NextResponse('Asset not found', { status: 404 })
	}

	const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${imagePayload.url}`)
	const buffer = await response.arrayBuffer()

	return new NextResponse(buffer)
}
