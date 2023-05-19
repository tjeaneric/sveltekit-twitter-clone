import { json } from '@sveltejs/kit'
import { createTweet, getTweets } from '$root/utils/prisma.js'

export const GET = async () => {
	// get the tweets and the user data (Prisma 😍)

	const tweets = await getTweets()

	if (!tweets) {
		return { status: 400 }
	}

	return json(tweets, { status: 200 })
}

export const POST = async ({ request }) => {
	const newTweet = await request.json()
	await createTweet(newTweet.tweet)
	return json(newTweet.tweet, { status: 201 })
}
