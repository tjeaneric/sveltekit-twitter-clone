import { json } from '@sveltejs/kit'

import prisma from '$lib/prisma'
import { timePosted } from '$root/lib/date'

export const GET = async () => {
	// get the tweets and the user data (Prisma 😍)
	const data = await prisma.tweet.findMany({
		include: { user: true },
		orderBy: { posted: 'desc' }
	})

	// get the liked tweets
	const liked = await prisma.liked.findMany({
		where: { userId: '1' },
		select: { tweetId: true }
	})

	// we just want an array of the ids
	const likedTweets = Object.keys(liked).map((key) => liked[key].tweetId)

	// we can shape the data however we want
	// so our user doesn't have to pay the cost for it
	const tweets = data.map((tweet) => {
		return {
			id: tweet.id,
			content: tweet.content,
			likes: tweet.likes,
			posted: timePosted(tweet.posted),
			url: tweet.url,
			avatar: tweet.user.avatar,
			handle: tweet.user.handle,
			name: tweet.user.name,
			liked: likedTweets.includes(tweet.id)
		}
	})

	if (!tweets) {
		return { status: 400 }
	}

	return json(tweets, { status: 200 })
}

export const POST = async ({ request }) => {
	const newTweet = await request.json()

	if (newTweet.tweet.length < 1 || newTweet.tweet.length > 150) {
		return json({
			status: 400,
			body: newTweet.tweet.length < 1 ? 'Please write something' : 'Maximum tweet length exceeded'
		})
	}

	await prisma.tweet.create({
		data: {
			posted: new Date(),
			url: Math.random().toString(16).slice(2),
			content: newTweet.tweet,
			likes: 0,
			user: { connect: { id: 'clhrqg9tl0000cm15qmx51fgt' } }
		}
	})
	return json(newTweet.tweet, { status: 200 })
}
