import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { BaseContent, Button, ContentMedia, InsightDisplay, Media } from '$payload-types'
import type { CSSProperties } from 'react'

export function cx(...args: ClassValue[]) {
	return twMerge(clsx(...args))
}

export type ColorBlock = BaseContent['textColor']

export type RadiusBlock = Media['rounded']

export type ObjectFitBlock = Media['objectFit']

export type GapBlock = ContentMedia['gap']

export type AlignBlock = Button['align']

export type PaddingBlock = InsightDisplay['padding']

export const colorVars = (option?: ColorBlock) => {
	if (!option?.base) {
		return undefined
	}

	let cssValue = 'inherit'
	if (option.base === 'customColor' && option?.custom) {
		cssValue = option.custom
	}

	if (option.base === 'base') {
		cssValue = 'var(--text-base-color)'
	}

	if (option.base !== 'inherit') {
		cssValue = `var(--${option?.base}-color)`
	}

	return cssValue
}

const radiusValue = (option?: RadiusBlock) => {
	if (!option?.base) {
		return undefined
	}

	if (option?.base === 'none') {
		return '0'
	}

	return `var(--mantine-radius-${option?.base || 'lg'})`
}

export const radiusVars = (option?: RadiusBlock) => {
	let cssValue = radiusValue(option)

	if (option?.base === 'custom') {
		cssValue = `${radiusValue(option.topLeft) || '0'} ${radiusValue(option.topRight) || '0'} ${radiusValue(option.bottomRight) || '0'} ${radiusValue(option.bottomLeft) || '0'}`
	}

	return cssValue
}

export const objectFitCls = (option?: ObjectFitBlock) => {
	if (option === 'contain') {
		return 'object-contain bg-contain'
	}

	return 'object-cover bg-cover'
}

export const gapVars = (option?: GapBlock) => {
	if (!option) {
		return null
	}

	return {
		className: `gap-[var(--gap)] gap-y-[var(--gap-y)]`,
		classNameWrapper: `mx-[calc(var(--gap)/-2)] mb-[calc(var(--gap-y)*-1)]`,
		classNameInner: `px-[calc(var(--gap)/2)] mb-[var(--gap-y)]`,
		vars: {
			['--gap' as string]: option.base || '0',
			['--gap-y' as string]: option.vertical || option.base || '0',
		},
	}
}

export const paddingVars = (
	option?: PaddingBlock,
): Pick<CSSProperties, 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft'> => {
	return {
		paddingTop: option?.top || undefined,
		paddingRight: option?.right || undefined,
		paddingBottom: option?.bottom || undefined,
		paddingLeft: option?.left || undefined,
	}
}

export const alignCls = (align?: AlignBlock, defaultValue?: string) => {
	if (align === 'left') {
		return 'flex justify-start'
	}

	if (align === 'center') {
		return 'flex justify-center'
	}

	if (align === 'right') {
		return 'flex justify-end'
	}

	if (align === 'full') {
		return 'w-full [&>*]:w-full'
	}

	return defaultValue || 'inline-block'
}
