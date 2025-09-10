'use server'
import { getPayload } from 'payload'

import configPromise from '$payload-config'
import type { FormSubmission } from '$payload-types'
import { assetUrl } from '$utils/common'

export type OptionsSendContactForm = {
	formId: number
	body: Record<string, string | string[] | number | number[] | boolean | File>
}

export const sendContactForm = async (options: OptionsSendContactForm) => {
	try {
		const payload = await getPayload({ config: configPromise })

		const submissionData: Required<FormSubmission['submissionData']> = []

		await Promise.all(
			Object.entries(options.body).map(async (item) => {
				const fieldName = item[0]
				let value = item[1]

				if (Array.isArray(value)) {
					value = value.join(', ')
				}

				if (value instanceof File) {
					if (
						value.type.startsWith('image/') === false &&
						(value.type === 'application/pdf') === false
					) {
						throw new Error('Invalid file type')
					}

					const bytes = await value.arrayBuffer()
					const buffer = Buffer.from(bytes)

					const asset = await payload.create({
						collection: 'asset',
						data: {},
						file: {
							data: buffer,
							size: value.size,
							name: value.name,
							mimetype: value.type,
						},
					})

					value = process.env.NEXT_PUBLIC_SITE_URL + assetUrl(asset)!
				}

				submissionData.push({
					field: fieldName,
					value: String(value),
				})
			}),
		)

		const formSubmission = await payload.create({
			collection: 'form-submissions',
			data: {
				form: options.formId,
				submissionData,
			},
			depth: 10,
		})

		return formSubmission
	} catch (error) {
		console.error('Error sending contact form', { error })

		return {
			error: 'Error sending contact form',
			details: error,
		}
	}
}
