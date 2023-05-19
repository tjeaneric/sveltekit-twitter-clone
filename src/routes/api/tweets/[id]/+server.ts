import { json } from '@sveltejs/kit'
import { getTweet, likeTweet, removeTweet } from '$root/utils/prisma'

export const GET = async ({ params }) => {
	const { id } = params
	const userTwet = await getTweet(id)

	return json(userTwet, { status: 200 })
}

export const PATCH = async ({ request }) => {
	const tweet = await request.json()
	const tweetId = tweet.id
	await likeTweet(tweetId)
	return json({ status: 303 })
}

export const DELETE = async ({ request }) => {
	const newTweet = await request.json()
	await removeTweet(newTweet.id)

	return json({ status: 204 })
}
