// GET /api/feed/reels - Video posts only
import { prisma } from '../../utils/db'
import { normalizePost } from '../../layers/feed/utils/feed.utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 20, 50)
  const offset = Math.max(Number(query.offset) || 0, 0)

  // Fetch posts that have at least one VIDEO media item (non-bg-music)
  const posts = await prisma.post.findMany({
    where: {
      visibility: 'PUBLIC',
      media: { some: { type: 'VIDEO', isBgMusic: false } },
    },
    include: {
      author: {
        select: { id: true, username: true, avatar: true, role: true },
      },
      media: {
        select: {
          id: true,
          url: true,
          type: true,
          isBgMusic: true,
          altText: true,
        },
      },
      _count: { select: { likes: true, comments: true, shares: true } },
    },
    orderBy: { created_at: 'desc' },
    take: limit,
    skip: offset,
  })

  const total = await prisma.post.count({
    where: {
      visibility: 'PUBLIC',
      media: { some: { type: 'VIDEO', isBgMusic: false } },
    },
  })

  return {
    success: true,
    data: posts.map(normalizePost),
    meta: { total, limit, offset, hasMore: offset + limit < total },
  }
})
