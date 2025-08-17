'use client'
import { Typography } from '@mantine/core'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { ComponentProps, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> &
	Omit<ComponentProps<typeof RichText>, 'data'> & {
		data?: ComponentProps<typeof RichText>['data'] | null
		basic?: boolean
	}

export default function Richtext({ data, basic, ...props }: Props) {
	if (!data) {
		return null
	}

	if (basic) {
		return (
			<span
				{...props}
				dangerouslySetInnerHTML={{
					__html: convertLexicalToHTML({
						data,
						disableContainer: true,
						disableTextAlign: true,
					}).replace(/^<p>(.*)<\/p>$/i, '$1'),
				}}
			/>
		)
	}

	return (
		<Typography
			{...props}
			data-slot="rich-text"
		>
			<RichText
				data={data}
				disableContainer={true}
			/>
		</Typography>
	)
}
