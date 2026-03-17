import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  // Trending data refreshes slowly — cache for 5 minutes
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=120')
  const [trendingProducts, trendingTags, featuredSellers] = await Promise.all([
    // Trending: most liked published products
    prisma.products.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        seller: {
          select: {
            store_name: true,
            store_slug: true,
            default_currency: true,
          },
        },
        media: {
          where: { isBgMusic: false },
          take: 1,
          select: { id: true, url: true, type: true, isBgMusic: true },
          orderBy: { created_at: 'asc' },
        },
        variants: { select: { id: true, stock: true, price: true, size: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { likes: { _count: 'desc' } },
      take: 10,
    }),

    // Trending tags: most products
    prisma.tag.findMany({
      where: { products: { some: {} } },
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } },
      },
      orderBy: { products: { _count: 'desc' } },
      take: 20,
    }),

    // Featured sellers: top by followers
    prisma.sellerProfile.findMany({
      where: { is_active: true },
      select: {
        id: true,
        store_name: true,
        store_slug: true,
        store_logo: true,
        store_banner: true,
        is_verified: true,
        followers_count: true,
        _count: { select: { products: true } },
      },
      orderBy: { followers_count: 'desc' },
      take: 6,
    }),
  ])

  return {
    success: true,
    data: { trendingProducts, trendingTags, featuredSellers },
  }
})
