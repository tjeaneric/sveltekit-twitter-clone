import prisma from '$root/lib/prisma'
import { timePosted } from '$lib/date'
import { json } from '@sveltejs/kit'

export async function getTweets() {
	const tweets = await prisma.tweet.findMany({
		include: { user: true },
		orderBy: { posted: 'desc' }
	})

	const likedTweets = await getLikedTweets()

	return tweets.map((tweet) => {
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
}

export async function getTweet(id: string) {
	const tweet = await prisma.tweet.findFirst({ where: { id }, include: { user: true } })

	const likedTweets = await getLikedTweets()
	if (tweet) {
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
	}
}

export async function getLikedTweets() {
	const liked = await prisma.liked.findMany({
		where: { userId: 'clhrqg9ua000icm15z9v2ktov' },
		select: { tweetId: true }
	})

	const likedTweets = Object.keys(liked).map((key) => liked[key].tweetId)

	return likedTweets
}

export async function createTweet(tweet: string) {
	if (tweet.length < 1 || tweet.length > 150) {
		return json({
			status: 400,
			body: tweet.length < 1 ? 'Please write something' : 'Maximum tweet length exceeded'
		})
	}

	// you can get the user from the session
	await prisma.tweet.create({
		data: {
			posted: new Date(),
			url: Math.random().toString(16).slice(2),
			content: tweet,
			likes: 0,
			user: { connect: { id: 'clhrqg9tl0000cm15qmx51fgt' } }
		}
	})
}

export async function removeTweet(id: string) {
	await prisma.tweet.delete({ where: { id } })
}

export async function likeTweet(id: string) {
	// verify if tweet is already liked
	const liked = await prisma.liked.count({ where: { tweetId: id } })
	// get the current like count and update it
	const count = await prisma.tweet.findUnique({ where: { id }, select: { likes: true } })

	if (count) {
		if (liked === 1) {
			// if tweet is already liked unlike it
			await prisma.liked.delete({ where: { tweetId: id } })

			// update the likes count
			await prisma.tweet.update({
				where: { id },
				data: { likes: (count.likes -= 1) }
			})

			return json({ status: 303 })
		}

		// add liked record
		await prisma.liked.create({
			data: {
				tweetId: id,
				user: { connect: { id: 'clhrqg9ua000icm15z9v2ktov' } }
			}
		})

		await prisma.tweet.update({
			where: { id },
			data: { likes: (count.likes += 1) }
		})
	}
}

export async function getUserProfile(params: string) {
	const profile = await prisma.user.findFirst({
		where: { handle: params }
	})

	const tweets = await prisma.tweet.findMany({
		where: { user: { id: profile?.id } },
		include: { user: true },
		orderBy: { posted: 'desc' }
	})

	// we just want an array of the ids
	const likedTweets = await getLikedTweets()

	if (!profile || !tweets || tweets.length === 0) return json({ status: 404 })

	const userTweets = tweets.map((tweet) => {
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

	return json({ profile, tweets: userTweets })
}
