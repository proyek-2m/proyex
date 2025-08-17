'use client'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import type { ComponentPropsWithoutRef } from 'react'

import IgnoreErrorBoundary from '$components/IgnoreErrorBoundary'

type Props = Omit<ComponentPropsWithoutRef<typeof DynamicIcon>, 'name'> & {
	name?: string | null
}

export default function Icon({ name, ...props }: Props) {
	if (!name) {
		return null
	}

	return (
		<IgnoreErrorBoundary>
			<DynamicIcon
				{...props}
				name={name as IconName}
			/>
		</IgnoreErrorBoundary>
	)
}
