'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

export default function LivePreviewListener() {
	const router = useRouter()

	return (
		<PayloadLivePreview
			refresh={router.refresh}
			serverURL={process.env.NEXT_PUBLIC_SITE_URL}
		/>
	)
}
