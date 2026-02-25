// GET /api/search?q=&type=all|users|products|posts&limit=&offset=
import { optionalAuth } from '../../layers/shared/middleware/requireAuth'
import { UserError } from '../../layers/profile/types/user.types'
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    await optionalAuth(event)
    const query = getQuery(event)
    const q = (query.q as string || '').trim()
    const type = (query.type as string) || 'all'
    const limit = Math.min(Number(query.limit) || 10, 50)
    const offset = Number(query.offset) || 0

    if (!q || q.length < 2) {
      return { success: true, data: { users: [], products: [], posts: [] } }
    }

    const searchFilter = { contains: q, mode: 'insensitive' as const }

    const [users, products, posts] = await Promise.all([
      type === 'all' || type === 'users'
        ? prisma.profile.findMany({
            where: {
              OR: [
                { username: searchFilter },
                { bio: searchFilter },
                { full_name: searchFilter }
              ]
            },
            select: { id: true, username: true, avatar: true, bio: true, full_name: true },
            take: limit,
            skip: offset
          })
        : [],

      type === 'all' || type === 'products'
        ? prisma.products.findMany({
            where: {
              status: 'PUBLISHED',
              OR: [
                { title: searchFilter },
                { description: searchFilter }
              ]
            },
            include: {
              seller: { select: { store_slug: true, store_name: true } },
              media: { select: { id: true, url: true, type: true }, take: 1 }
            },
            take: limit,
            skip: offset
          })
        : [],

      type === 'all' || type === 'posts'
        ? prisma.post.findMany({
            where: {
              OR: [
                { caption: searchFilter },
                { content: searchFilter }
              ]
            },
            include: {
              author: { select: { id: true, username: true, avatar: true } },
              media: { select: { id: true, url: true, type: true }, take: 1 },
              _count: { select: { likes: true, comments: true } }
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset
          })
        : []
    ])

    return {
      success: true,
      data: { users, products, posts }
    }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
