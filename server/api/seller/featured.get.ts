// GET /api/seller/featured - Public list of top sellers by follower count
import { prisma } from '../../utils/db'

export default defineEventHandler(async () => {
  const sellers = await prisma.sellerProfile.findMany({
    where: { is_active: true },
    select: {
      id: true,
      store_name: true,
      store_slug: true,
      store_logo: true,
      is_verified: true,
      followers_count: true,
      _count: { select: { products: true } }
    },
    orderBy: { followers_count: 'desc' },
    take: 6,
  })
  return { success: true, data: sellers }
})
