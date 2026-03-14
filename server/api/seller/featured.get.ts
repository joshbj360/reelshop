// GET /api/seller/featured - Public list of sellers by follower count (paginated)
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Math.max(Number(query.limit) || 6, 1), 50)
  const offset = Math.max(Number(query.offset) || 0, 0)
  const search = String(query.search || '').trim()

  const where: any = { is_active: true }
  if (search) {
    where.OR = [
      { store_name: { contains: search, mode: 'insensitive' } },
      { store_slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [sellers, total] = await Promise.all([
    prisma.sellerProfile.findMany({
      where,
      select: {
        id: true,
        store_name: true,
        store_slug: true,
        store_logo: true,
        store_banner: true,
        store_description: true,
        is_verified: true,
        followers_count: true,
        _count: { select: { products: true } }
      },
      orderBy: { followers_count: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.sellerProfile.count({ where }),
  ])

  // Compute real follow counts from the Follow table
  const sellerIds = sellers.map((s: any) => s.id)
  const followCounts = sellerIds.length
    ? await prisma.follow.groupBy({
        by: ['followingId'],
        where: { followingId: { in: sellerIds }, followingType: 'SELLER' },
        _count: { followerId: true },
      })
    : []

  const countMap = new Map(followCounts.map((f: any) => [f.followingId, f._count.followerId]))

  const sellersWithRealCounts = sellers.map((s: any) => {
    const realCount = countMap.get(s.id) ?? 0
    // Sync stale counter non-blocking
    if (s.followers_count !== realCount) {
      prisma.sellerProfile.update({ where: { id: s.id }, data: { followers_count: realCount } }).catch(() => {})
    }
    return { ...s, followers_count: realCount }
  })

  return {
    success: true,
    data: sellersWithRealCounts,
    meta: { total, limit, offset, hasMore: offset + sellers.length < total }
  }
})
