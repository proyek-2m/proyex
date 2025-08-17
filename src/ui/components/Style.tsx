'use client'
import { useMemo } from 'react'

import { type GapBlock } from '$utils/styles'

export type StyleGapProps = {
	id: string
	data?: GapBlock
}

export function StyleGap({ id, data }: StyleGapProps) {
	const cssVars = useMemo(() => {
		let vars = ''

		if (data?.base) {
			vars += `--gap: ${data.base};`
		}

		if (data?.vertical) {
			vars += `--gap-y: ${data.vertical};`
		} else if (data?.base) {
			vars += `--gap-y: ${data.base};`
		}

		return vars
	}, [data])

	if (!data || !cssVars) {
		return null
	}

	return (
		<style>
			{`
            @layer utilities {
                #${id} {
                    ${cssVars}
                }
            }
            `}
		</style>
	)
}
