// GET /api/commerce/categories
import { prisma } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  // Categories rarely change — cache for 10 minutes in browser + CDN
  setHeader(
    event,
    'Cache-Control',
    'public, max-age=600, s-maxage=600, stale-while-revalidate=300',
  )

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, thumbnailCatUrl: true },
    orderBy: { name: 'asc' },
  })
  return { success: true, data: categories }
})
