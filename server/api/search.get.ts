// GET /api/search?q=...&type=all|users|products|posts|stores&limit=10
import { prisma } from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const type = String(query.type || 'all')
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 30)

  if (!q || q.length < 2) {
    return { success: true, data: { users: [], products: [], posts: [], stores: [] } }
  }

  const searchAll = type === 'all'

  const [users, products, posts, stores] = await Promise.all([
    searchAll || type === 'users'
      ? prisma.profile.findMany({
          where: {
            OR: [
              { username: { contains: q, mode: 'insensitive' } },
              { full_name: { contains: q, mode: 'insensitive' } },
            ],
          },
          select: { id: true, username: true, full_name: true, avatar: true, role: true },
          take: limit,
        })
      : Promise.resolve([] as any[]),

    searchAll || type === 'products'
      ? prisma.products.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            media: { where: { isBgMusic: false }, select: { url: true, type: true }, take: 1 },
            seller: { select: { store_name: true, store_slug: true } },
          },
          take: limit,
        })
      : Promise.resolve([] as any[]),

    searchAll || type === 'posts'
      ? prisma.post.findMany({
          where: {
            visibility: 'PUBLIC',
            OR: [
              { caption: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            caption: true,
            content: true,
            media: { where: { isBgMusic: false }, select: { url: true, type: true }, take: 1 },
            author: { select: { username: true, avatar: true } },
            _count: { select: { likes: true } },
          },
          take: limit,
        })
      : Promise.resolve([] as any[]),

    searchAll || type === 'stores'
      ? prisma.sellerProfile.findMany({
          where: {
            is_active: true,
            OR: [
              { store_name: { contains: q, mode: 'insensitive' } },
              { store_slug: { contains: q, mode: 'insensitive' } },
              { store_description: { contains: q, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            store_name: true,
            store_slug: true,
            store_logo: true,
            store_description: true,
            followers_count: true,
          },
          take: limit,
        })
      : Promise.resolve([] as any[]),
  ])

  return {
    success: true,
    data: { users, products, posts, stores },
  }
})
