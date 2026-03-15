import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 50, 100)
  const search = String(query.search || '').trim()

  const where: any = {}
  if (search) {
    where.name = { contains: search, mode: 'insensitive' }
  }
  // Only return tags that have at least one product
  where.products = { some: {} }

  const tags = await prisma.tag.findMany({
    where,
    select: {
      id: true,
      name: true,
      _count: { select: { products: true } },
    },
    orderBy: { products: { _count: 'desc' } },
    take: limit,
  })

  return { success: true, data: tags }
})
