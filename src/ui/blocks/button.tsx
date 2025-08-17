'use client'
import { Button as ButtonMantine, type ButtonProps as ButtonPropsMantine } from '@mantine/core'
import { useMemo, type ElementType, type ReactNode } from 'react'

import Icon from '$components/Icon'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import type { Button as ButtonBlock } from '$payload-types'
import { alignCls, colorVars, cx, radiusVars } from '$utils/styles'

type ButtonBlockType = ButtonBlock | Omit<ButtonBlock, 'blockType'> | null

export type ButtonProps = {
	block?: ButtonBlockType
} & ButtonPropsMantine

export default function Button({ block, className, ...props }: ButtonProps) {
	if (!block?.label) {
		return null
	}

	if (block?.link?.href) {
		return (
			<ButtonWrapper
				block={block}
				className={className}
			>
				<ButtonSelf
					{...props}
					component={Link}
					// @ts-expect-error
					href={block.link.href}
					target={block.link.target || '_self'}
					block={block}
				/>
			</ButtonWrapper>
		)
	}

	return (
		<ButtonWrapper
			block={block}
			className={className}
		>
			<ButtonSelf
				{...props}
				block={block}
			/>
		</ButtonWrapper>
	)
}

function ButtonSelf({
	block,
	children,
	component,
	...props
}: ButtonProps & {
	component?: ElementType
}) {
	const icon = useMemo(() => {
		if (!block?.icon?.name) {
			return null
		}

		const iconComp = (
			<Icon
				name={block?.icon?.name}
				color={colorVars(block?.icon?.color)}
				size={(block?.icon?.size || 1) * 16}
			/>
		)

		return {
			left: block?.icon?.position === 'left' ? iconComp : null,
			right: block?.icon?.position !== 'left' ? iconComp : null,
		}
	}, [block])

	return (
		<ButtonMantine
			{...props}
			// @ts-expect-error
			component={component || 'button'}
			variant={block?.variant || props.variant || 'filled'}
			size={block?.size || props.size || 'lg'}
			radius={radiusVars(block?.rounded) || props.radius || 'lg'}
			color={colorVars(block?.color) || props.color || 'primary'}
			leftSection={icon?.left}
			rightSection={icon?.right}
		>
			{children || (
				<Richtext
					data={block?.label}
					basic
				/>
			)}
		</ButtonMantine>
	)
}

function ButtonWrapper({
	block,
	children,
	className,
}: {
	block?: ButtonBlockType | null
	children: ReactNode
	className?: string
}) {
	return (
		<div
			data-slot="button"
			className={cx(alignCls(block?.align), className)}
		>
			{children}
		</div>
	)
}
