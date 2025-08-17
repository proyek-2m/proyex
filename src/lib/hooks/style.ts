import { useMemo } from 'react'

import { useIsMedia } from '$hooks/media-query'
import type { Banner } from '$payload-types'

export const useBackgroundImage = (block: Banner['backgroundImage']) => {
	const mediaQuery = useIsMedia()

	const bgImage = useMemo(() => {
		if (mediaQuery.mobile && block?.mobile) {
			return block.mobile
		}

		return block?.general
	}, [block, mediaQuery])

	return bgImage
}
