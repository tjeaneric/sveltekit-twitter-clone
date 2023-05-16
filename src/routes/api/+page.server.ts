import type { PageServerLoad, Actions } from './$types'

export const load = (async ({ fetch }) => {
	async function getItem() {
		const res = await fetch('/api/items')
		const data = await res.json()
		return data
	}
	return { item: getItem() }
}) satisfies PageServerLoad

export const actions = {
	changeItem: async ({ request }) => {
		const data = await request.formData()
		const item1 = data.get('item')

		await fetch('http://localhost:5173/api/items', {
			method: 'POST',
			body: JSON.stringify({ item1 }),
			headers: { 'Content-Type': 'application/json' }
		})
	}
} satisfies Actions
