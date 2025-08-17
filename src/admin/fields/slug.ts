import type { Field } from 'payload'

import { slugify } from '$utils/common'

export const slugField: Field = {
	name: 'slug',
	type: 'text',
	required: true,
	unique: true,
	hooks: {
		beforeValidate: [
			({ data, operation, value }) => {
				if (typeof value === 'string') {
					return slugify(value)
				}

				if (operation === 'create' || !data?.slug) {
					const fallbackData = data?.title

					if (fallbackData && typeof fallbackData === 'string') {
						return slugify(fallbackData)
					}
				}

				return value
			},
		],
	},
	admin: {
		components: {
			Field: {
				path: '$payload-fields/components/slug#SlugField',
			},
		},
	},
}
