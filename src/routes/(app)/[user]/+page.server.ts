import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ fetch, params }) => {
	async function getUser() {
		const res = await fetch(`/api/users/${params.user}`)
		const data = await res.json()
		return data
	}
	return { userData: getUser() }
}) satisfies PageServerLoad

export const actions = {
	createTweet: async ({ request }) => {
		const data = await request.formData()
		const tweet = data.get('tweet')

		const res = await fetch('http://localhost:5173/api/tweets', {
			method: 'POST',
			body: JSON.stringify({ tweet }),
			headers: { 'Content-Type': 'application/json' }
		})

		const res_data = await res.json()

		return res_data
	},

	deleteTweet: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id')

		const res = await fetch(`http://localhost:5173/api/tweets/${id}`, {
			method: 'DELETE',
			body: JSON.stringify({ id }),
			headers: { 'Content-Type': 'application/json' }
		})

		const res_data = await res.json()

		return res_data
	},

	likeTweet: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id')

		const res = await fetch(`http://localhost:5173/api/tweets/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ id }),
			headers: { 'Content-Type': 'application/json' }
		})

		const res_data = await res.json()

		return res_data
	}
} satisfies Actions
