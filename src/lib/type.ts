import type { Client, Page, Post, PostCategory, Product, Reusable } from '$payload-types'

export type Queried =
	| {
			collection: 'pages'
			data: Page
	  }
	| {
			collection: 'posts'
			data: Post
	  }
	| {
			collection: 'products'
			data: Product
	  }
	| {
			collection: 'clients'
			data: Client
	  }
	| {
			collection: 'postCategories'
			data: PostCategory
	  }
	| {
			collection: 'reusables'
			data: Reusable
	  }
