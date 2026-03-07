// GET /api/commerce/categories
import { prisma } from '../../../utils/db'

export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, thumbnailCatUrl: true },
    orderBy: { name: 'asc' }
  })
  return { success: true, data: categories }
})
