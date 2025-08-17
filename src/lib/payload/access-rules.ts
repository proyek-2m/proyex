import type { Access, AccessArgs } from 'payload'

import type { User } from '$payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
	return Boolean(user)
}

export const authenticatedActionRole: Access = ({ data, req: { user } }) => {
	if (data?.author && user?.role === 'author' && data.author !== user.id) {
		return false
	}

	return true
}

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
	if (user) {
		return true
	}

	return {
		_status: {
			equals: 'published',
		},
	}
}
