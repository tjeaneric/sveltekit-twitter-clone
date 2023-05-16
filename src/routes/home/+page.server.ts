import type { PageServerLoad } from './$types'

export const load = (async ({ fetch }) => {
	async function getTweets() {
		const res = await fetch('/api/tweets')
		const data = await res.json()
		return data
	}
	return { tweets: getTweets() }
}) satisfies PageServerLoad
