import type { PayloadRequest } from 'payload'

type Props = {
	path: string
	req: PayloadRequest
}

export const generatePreviewPath = ({ path, req }: Props) => {
	const encodedParams = new URLSearchParams({
		path,
		previewSecret: process.env.PAYLOAD_PREVIEW_SECRET,
	})

	const url = `//${req.host}/next/preview?${encodedParams.toString()}`

	return url
}
