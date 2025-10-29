'use client'
import {
	Alert,
	Button,
	Checkbox,
	CheckboxGroup,
	FileInput,
	MultiSelect,
	NumberInput,
	Radio,
	RadioGroup,
	Select,
	SimpleGrid,
	Textarea,
	TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useId, useMemo, useState, type HTMLAttributes } from 'react'
import * as z from 'zod'

import Richtext from '$components/Richtext'
import { useWindowScrollTo } from '$hooks/scroll'
import { useRouter } from '$hooks/use-router'
import type { Form as FormBlock } from '$payload-types'
import { sendContactForm, type OptionsSendContactForm } from '$server-functions/contact-form'
import { slugify } from '$utils/common'

import styles from '$styles/layouts/contact-form.module.css'

export type ContactFormType = {
	data: FormBlock | number
} & HTMLAttributes<HTMLFormElement>

export default function ContactForm({ data, ...props }: ContactFormType) {
	const compId = useId()
	const searchParams = useSearchParams()
	const router = useRouter()
	const scrollTo = useWindowScrollTo()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [hasSuccessSend, setHasSuccessSend] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const refId = useMemo(() => {
		return props.id || slugify(compId)
	}, [props, compId])

	const formSchema = useMemo((): z.ZodObject => {
		if (typeof data === 'number') {
			return z.object()
		}

		const schema: Record<string, z.ZodTypeAny> = {}

		data.fields?.forEach((field) => {
			if (field.blockType === 'checkbox') {
				if (field.required) {
					schema[field.name] = z.literal(true, 'Must be checked')
				} else {
					schema[field.name] = z.boolean('Unexpected value').default(false).optional()
				}
			} else if (field.blockType === 'checkboxOptions') {
				if (field.required) {
					schema[field.name] = z
						.array(
							z.string('Fill out this field').nonempty(),
							'Must select at least one',
						)
						.min(1, 'Must select at least one')
				} else {
					schema[field.name] = z.array(z.string(), 'Must select at least one').optional()
				}
			} else if (field.blockType === 'select' && field.multiple) {
				if (field.required) {
					schema[field.name] = z
						.array(z.string('Fill out this field').nonempty())
						.min(1, 'Must select at least one')
				} else {
					schema[field.name] = z.array(z.string()).optional()
				}
			} else if (field.blockType === 'upload') {
				if (field.required) {
					schema[field.name] = z.file('Must upload a file')
				} else {
					schema[field.name] = z.file('Must upload a file').optional()
				}
			} else if (field.blockType === 'number') {
				if (field.required) {
					schema[field.name] = z
						.number('Must be a number')
						.min(1, 'Must be greater than 0')
				} else {
					schema[field.name] = z.number('Must be a number').optional()
				}
			} else if (field.blockType === 'email') {
				if (field.required) {
					schema[field.name] = z
						.email('Must be a valid email')
						.nonempty('Must not be empty')
				} else {
					schema[field.name] = z.email('Must be a valid email').optional()
				}
			} else if (field.blockType === 'telephone') {
				if (field.required) {
					schema[field.name] = z
						.string('Must be a valid phone number')
						.nonempty('Must not be empty')
						.min(10, 'Must be a valid phone number')
				} else {
					schema[field.name] = z.string().optional()
				}
			} else if (field.required) {
				schema[field.name] = z.string('Fill out this field').nonempty('Must not be empty')
			} else {
				schema[field.name] = z.string().optional()
			}
		})

		return z.object(schema)
	}, [data])

	const form = useForm({
		validate: zod4Resolver(formSchema),
	})

	const disableField = useMemo(() => {
		return hasSuccessSend || isSubmitting
	}, [hasSuccessSend, isSubmitting])

	const handlerSubmit = useCallback(
		async (payload: Record<string, unknown> | OptionsSendContactForm['body']) => {
			if (typeof data === 'number' || !data.fields) {
				return
			}

			setIsSubmitting(true)

			const resultSendContactForm = await sendContactForm({
				formId: data.id,
				body: payload as OptionsSendContactForm['body'],
			})

			if ('error' in resultSendContactForm) {
				setHasSuccessSend(false)
				setErrorMessage(resultSendContactForm.error)
				return
			}

			setHasSuccessSend(true)
			setIsSubmitting(false)

			if (data.confirmationType === 'redirect') {
				if (data?.redirect?.type === 'custom' && data.redirect.url) {
					router.replace(data.redirect.url)
				} else if (
					data?.redirect?.type === 'reference' &&
					typeof data.redirect.reference?.value === 'object' &&
					data.redirect.reference.value.link
				) {
					router.replace(data.redirect.reference.value.link)
				}
			}
		},
		[router, data],
	)

	useEffect(() => {
		if (typeof data === 'object' && data.fields) {
			data.fields.forEach((field) => {
				const defaultValueBySearchParam = searchParams.get(field.name)

				if (field.blockType === 'checkboxOptions') {
					if (defaultValueBySearchParam) {
						form.setFieldValue(field.name, defaultValueBySearchParam.split(','))
					} else if (field.defaultValue) {
						form.setFieldValue(field.name, [field.defaultValue])
					} else {
						form.setFieldValue(field.name, [])
					}
				} else if (field.blockType === 'select' && field.multiple) {
					if (defaultValueBySearchParam) {
						form.setFieldValue(field.name, defaultValueBySearchParam.split(','))
					} else if (field.defaultValue) {
						form.setFieldValue(field.name, [field.defaultValue])
					} else {
						form.setFieldValue(field.name, [])
					}
				} else if (defaultValueBySearchParam) {
					form.setFieldValue(field.name, defaultValueBySearchParam)
				} else if (
					'defaultValue' in field &&
					typeof field.defaultValue !== 'undefined' &&
					typeof field.defaultValue !== 'object'
				) {
					form.setFieldValue(field.name, field.defaultValue)
				}
			})
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const handlerError = useCallback(() => {
		const timerScroll = setTimeout(() => {
			scrollTo(document.querySelector("[data-error='true']"))
		}, 100)

		return () => clearTimeout(timerScroll)
	}, [scrollTo])

	if (typeof data === 'number' || !data.fields) {
		return null
	}

	if (hasSuccessSend && data.confirmationType === 'message') {
		return (
			<Alert
				title="Formulir berhasil dikirim"
				color="green"
			>
				<Richtext data={data.confirmationMessage} />
			</Alert>
		)
	}

	return (
		<form
			{...props}
			id={refId}
			onSubmit={form.onSubmit(handlerSubmit, handlerError)}
		>
			{errorMessage ? (
				<p className="text-[var(--mantine-color-error)]">{errorMessage}</p>
			) : null}

			<div className={styles.fields}>
				{data.fields.map((field, index) => {
					const id = field.blockName || `${refId}-${field.name}-${field.id || index}`
					if (field.blockType === 'text') {
						return (
							<TextInput
								key={id}
								id={id}
								withAsterisk={!!field.required}
								label={field.label}
								name={field.name}
								placeholder={field.placeholder || undefined}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name)}
							/>
						)
					}

					if (field.blockType === 'textarea') {
						return (
							<Textarea
								key={id}
								id={id}
								withAsterisk={!!field.required}
								label={field.label}
								name={field.name}
								placeholder={field.placeholder || undefined}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name)}
							/>
						)
					}

					if (field.blockType === 'checkbox') {
						return (
							<Checkbox
								key={id}
								id={id}
								label={
									<>
										{field.label}
										<span
											className="text-[var(--mantine-color-error)]"
											aria-hidden
										>
											{field.required ? ' *' : ''}
										</span>
									</>
								}
								name={field.name}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name, { type: 'checkbox' })}
							/>
						)
					}

					if (field.blockType === 'email') {
						return (
							<TextInput
								key={id}
								id={id}
								type="email"
								withAsterisk={!!field.required}
								label={field.label}
								name={field.name}
								placeholder={field.placeholder || undefined}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name)}
							/>
						)
					}

					if (field.blockType === 'telephone') {
						return (
							<TextInput
								key={id}
								id={id}
								type="tel"
								withAsterisk={!!field.required}
								label={field.label}
								name={field.name}
								placeholder={field.placeholder || undefined}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name)}
							/>
						)
					}

					if (field.blockType === 'number') {
						return (
							<NumberInput
								key={id}
								id={id}
								withAsterisk={!!field.required}
								label={field.label}
								name={field.name}
								placeholder={field.placeholder || undefined}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name)}
							/>
						)
					}

					if (field.blockType === 'upload') {
						return (
							<FileInput
								key={id}
								id={id}
								withAsterisk={!!field.required}
								label={field.label}
								name={field.name}
								placeholder={field.placeholder || undefined}
								accept={
									field.allowedTypes
										? field.allowedTypes
												.map((type) =>
													type === 'image'
														? 'image/*'
														: type === 'pdf'
															? 'application/pdf'
															: undefined,
												)
												.filter(Boolean)
												.join(',')
										: undefined
								}
								style={{
									width: `${field.width || 100}%`,
								}}
								disabled={disableField}
								{...form.getInputProps(field.name)}
							/>
						)
					}

					if (field.blockType === 'select' && field.options && field.options.length) {
						if (field.multiple) {
							return (
								<MultiSelect
									key={id}
									id={id}
									withAsterisk={!!field.required}
									label={field.label}
									name={field.name}
									data={field.options}
									placeholder={field.placeholder || undefined}
									style={{
										width: `${field.width || 100}%`,
									}}
									disabled={disableField}
									{...form.getInputProps(field.name)}
								/>
							)
						} else {
							return (
								<Select
									key={id}
									id={id}
									withAsterisk={!!field.required}
									label={field.label}
									name={field.name}
									data={field.options}
									placeholder={field.placeholder || undefined}
									style={{
										width: `${field.width || 100}%`,
									}}
									disabled={disableField}
									{...form.getInputProps(field.name)}
								/>
							)
						}
					}

					if (
						field.blockType === 'checkboxOptions' &&
						field.options &&
						field.options.length
					) {
						return (
							<CheckboxGroup
								key={id}
								id={id}
								withAsterisk={!!field.required}
								label={field.label}
								style={{
									width: `${field.width || 100}%`,
								}}
								{...form.getInputProps(field.name)}
							>
								<SimpleGrid
									cols={{
										base: 1,
										md: field.column || 4,
									}}
									spacing={{
										base: 'xs',
										md: `${field.gap || 8}px`,
									}}
									verticalSpacing={{
										base: 'xs',
										md: `${field.gap || 8}px`,
									}}
								>
									{field.options.map((option) => (
										<Checkbox
											key={`${id}-${option.value}`}
											value={option.value}
											label={option.label}
											disabled={disableField}
										/>
									))}
								</SimpleGrid>
							</CheckboxGroup>
						)
					}

					if (
						field.blockType === 'radioOptions' &&
						field.options &&
						field.options.length
					) {
						return (
							<RadioGroup
								key={id}
								id={id}
								withAsterisk={!!field.required}
								label={field.label}
								style={{
									width: `${field.width || 100}%`,
								}}
								{...form.getInputProps(field.name)}
							>
								<SimpleGrid
									cols={{
										base: 1,
										md: field.column || 4,
									}}
									spacing={{
										base: 'xs',
										md: `${field.gap || 8}px`,
									}}
									verticalSpacing={{
										base: 'xs',
										md: `${field.gap || 8}px`,
									}}
								>
									{field.options.map((option) => (
										<Radio
											key={`${id}-${option.value}`}
											value={option.value}
											label={option.label}
											disabled={disableField}
										/>
									))}
								</SimpleGrid>
							</RadioGroup>
						)
					}

					return null
				})}
			</div>
			<div className={styles.actions}>
				<Button
					type="submit"
					size="lg"
					loading={isSubmitting}
					disabled={disableField}
				>
					{hasSuccessSend ? 'Redirecting...' : data.submitButtonLabel}
				</Button>
			</div>
		</form>
	)
}
