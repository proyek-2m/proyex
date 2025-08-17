'use client'
import type { TextFieldClientProps } from 'payload'
import { useCallback } from 'react'

import { slugify } from '$utils/common'
import { Button, FieldLabel, TextInput, useField, useFormFields } from '@payloadcms/ui'

export const SlugField: React.FC<TextFieldClientProps> = ({ field, path, ...props }) => {
	const { value, setValue } = useField<string>({ path: path || field.name })

	const titleValue = useFormFields(([fields]) => {
		return fields?.title?.value as string
	})

	const handlerAutoGenerate = useCallback(() => {
		if (titleValue) {
			setValue(slugify(titleValue))
		}
	}, [titleValue, setValue])

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 4,
				}}
			>
				<FieldLabel {...field} />
				<Button
					buttonStyle="pill"
					size="small"
					className="cta-autogen"
					onClick={handlerAutoGenerate}
				>
					Auto generate
				</Button>
			</div>
			<TextInput
				{...field}
				{...props}
				label={undefined}
				value={value}
				onChange={setValue}
				path={path || field.name}
			/>
			<style>{`
				.cta-autogen {
					margin: 0
				}
			`}</style>
		</>
	)
}
