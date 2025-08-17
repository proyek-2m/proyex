import { linkCollection } from '$payload-libs/link-utils'
import type {
	Client,
	Page,
	Post,
	PostCategory,
	Reusable,
	Team,
	TeamPosition,
	Template,
} from '$payload-types'
import type { AfterReadHook } from 'node_modules/payload/dist/collections/config/types'
import type { Field } from 'payload'

export const linkField: Field = {
	name: 'link',
	type: 'text',
	virtual: true,
	admin: {
		readOnly: true,
		components: {
			Field: {
				path: '$payload-fields/components/link#LinkField',
			},
		},
	},
}

export const afterReadHookLink: AfterReadHook<
	Client | Page | Team | TeamPosition | Post | PostCategory | Template | Reusable
> = ({ doc, collection }) => {
	const post = {
		link: linkCollection({
			collection: collection.slug,
			doc,
		}),
		...doc,
	}

	return post
}
