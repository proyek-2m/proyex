import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import configPromise from '$payload-config'

export async function GET(
	req: {
		cookies: {
			get: (name: string) => {
				value: string
			}
		}
	} & Request,
): Promise<Response> {
	const payload = await getPayload({ config: configPromise })

	const { searchParams } = new URL(req.url)

	const path = searchParams.get('path')
	const previewSecret = searchParams.get('previewSecret')

	if (previewSecret !== process.env.PAYLOAD_PREVIEW_SECRET) {
		return new Response('You are not allowed to preview this page', { status: 403 })
	}

	if (!path) {
		return new Response('Insufficient search params', { status: 404 })
	}

	if (!path.startsWith('/')) {
		return new Response('This endpoint can only be used for relative previews', { status: 500 })
	}

	let user

	try {
		user = await payload.auth({
			req: req as unknown as PayloadRequest,
			headers: req.headers,
		})
	} catch {
		return new Response('You are not allowed to preview this page', { status: 403 })
	}

	const draft = await draftMode()

	if (!user) {
		draft.disable()
		return new Response('You are not allowed to preview this page', { status: 403 })
	}

	draft.enable()

	redirect(path)
}
