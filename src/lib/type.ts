import type {
	Client,
	Page,
	Post,
	PostCategory,
	Reusable,
	Service,
	Team,
	TeamPosition,
	Template,
} from '$payload-types'

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
			collection: 'teams'
			data: Team
	  }
	| {
			collection: 'services'
			data: Service
	  }
	| {
			collection: 'teamPositions'
			data: TeamPosition
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
			collection: 'templates'
			data: Template
	  }
	| {
			collection: 'reusables'
			data: Reusable
	  }
