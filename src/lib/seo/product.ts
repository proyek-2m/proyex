import type { Product as ProductSchema } from 'schema-dts'

import type { Product } from '$payload-types'
import { assetUrl } from '$utils/common'

export const productSchema = (data: Product): ProductSchema => {
	return {
		'@type': 'Product',
		name: data.meta?.title || data.title,
		description: data.meta?.description || data.excerpt || undefined,
		url: data.link || undefined,
		image: assetUrl(data.meta?.image || data.featuredImage),
	}
}
