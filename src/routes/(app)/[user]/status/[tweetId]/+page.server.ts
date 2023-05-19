import type { PageServerLoad } from './$types'

export const load = (async ({ fetch, params }) => {
	async function getUser() {
		const res = await fetch(`/api/tweets/${params.tweetId}`)
		const data = await res.json()
		return data
	}
	return { userTweet: getUser() }
}) satisfies PageServerLoad
