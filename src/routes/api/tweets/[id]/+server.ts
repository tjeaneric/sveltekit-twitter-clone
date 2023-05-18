import { json } from '@sveltejs/kit'

import prisma from '$lib/prisma'
import { timePosted } from '$root/lib/date.js'

export const GET = async ({ params }) => {
	const { id } = params
	const tweet = await prisma.tweet.findFirst({ where: { id }, include: { user: true } })
	const liked = await prisma.liked.findMany({
		where: { userId: tweet?.userId },
		select: { tweetId: true }
	})

	const likedTweets = Object.keys(liked).map((k) => liked[k].tweetId)

	const userTwet = {
		id: tweet?.id,
		content: tweet?.content,
		likes: tweet?.likes,
		posted: timePosted(tweet?.posted),
		url: tweet?.url,
		avatar: tweet?.user.avatar,
		handle: tweet?.user.handle,
		name: tweet?.user.name,
		liked: likedTweets.includes(tweet?.id)
	}
	return json(userTwet, {status:200})
}

export const PATCH = async ({ request }) => {
	const tweet = await request.json()
	const tweetId = tweet.id
	const liked = await prisma.liked.count({ where: { tweetId } })
	const count = await prisma.tweet.findUnique({ where: { id: tweetId }, select: { likes: true } })

	if (liked === 1) {
		await prisma.liked.delete({ where: { tweetId } })

		await prisma.tweet.update({
			where: { id: tweetId },
			data: { likes: (count.likes -= 1) }
		})

		return json({ status: 303 })
	}

	await prisma.liked.create({
		data: {
			tweetId,
			user: { connect: { id: 'clhrqg9ua000icm15z9v2ktov' } }
		}
	})

	await prisma.tweet.update({
		where: { id: tweetId },
		data: { likes: (count.likes += 1) }
	})
	return json({ status: 303 })
}

export const DELETE = async ({ request }) => {
	const newTweet = await request.json()
	const tweetId = newTweet.id

	await prisma.tweet.delete({ where: { id: tweetId } })
	return json({ status: 204 })
}
