import { json } from '@sveltejs/kit'

import prisma from '$lib/prisma'

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
