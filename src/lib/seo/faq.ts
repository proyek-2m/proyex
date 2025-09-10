import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { FAQPage, WithContext } from 'schema-dts'

import type { Faq } from '$payload-types'

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export const faqSchema = (faqs: Faq[]): WithContext<FAQPage> => {
	const mainEntity: Writeable<FAQPage['mainEntity']> = []

	faqs.forEach((faq) => {
		if (faq.message && faq.title) {
			mainEntity.push({
				'@type': 'Question',
				name: faq.title,
				acceptedAnswer: {
					'@type': 'Answer',
					text: convertLexicalToPlaintext({
						data: faq.message,
					}),
				},
			})
		}
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity,
	}
}
