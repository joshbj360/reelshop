// GET /api/search?q=...&type=all|users|products|posts&limit=10
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const type = String(query.type || 'all')
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 30)

  if (!q || q.length < 2) {
    return { success: true, data: { users: [], products: [], posts: [] } }
  }

  const [users, products, posts] = await Promise.all([
    (type === 'all' || type === 'users')
      ? prisma.profile.findMany({
          where: {
            OR: [
              { username: { contains: q, mode: 'insensitive' } },
              { full_name: { contains: q, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar: true,
            bio: true,
            role: true,
          },
          take: limit,
        })
      : [],

    (type === 'all' || type === 'products')
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
      : [],

    (type === 'all' || type === 'posts')
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
      : [],
  ])

  return {
    success: true,
    data: { users, products, posts },
  }
})
