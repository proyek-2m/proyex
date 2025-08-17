import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { SerializedEditorState } from 'lexical'

export function readingTime(data?: SerializedEditorState[] | null) {
	if (!data) {
		return 0
	}

	const wpm = 200
	let time = 0

	data.forEach((item) => {
		const content = convertLexicalToPlaintext({
			data: item,
		})

		time += Math.ceil(content.split(/\s+/).length / wpm)
	})

	return time
}
