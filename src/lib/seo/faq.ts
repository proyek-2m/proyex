import type { FAQPage, WithContext } from 'schema-dts'

import type { Faq } from '$payload-types'

function faqMessageToPlainText(lexicalState: NonNullable<Faq['message']>) {
	let plainText = ''

	function traverse(
		nodes: (NonNullable<Faq['message']>['root']['children'][number] & {
			children?: NonNullable<Faq['message']>['root']['children']
		})[],
	) {
		nodes.forEach((node) => {
			if (node.type === 'text') {
				plainText += node.text
			} else if (node.children) {
				traverse(node.children)
			}

			if (
				['paragraph', 'heading', 'listitem'].includes(node.type) &&
				nodes.indexOf(node) < nodes.length - 1
			) {
				plainText += '\n'
			}
		})
	}

	traverse(lexicalState.root.children)
	return plainText
}

export const faqSchema = (faqs: Faq[]): WithContext<FAQPage> => {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs
			.filter((faq) => !!faq.title && !!faq.message)
			.map((faq) => ({
				'@type': 'Question',
				name: faq.title!,
				acceptedAnswer: {
					'@type': 'Answer',
					text: faqMessageToPlainText(faq.message!),
				},
			})),
	}
}
