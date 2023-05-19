import { getUserProfile } from '$root/utils/prisma'

export const GET = async ({ params }) => {
	return await getUserProfile(`@${params.name}`)
}
