// GET /api/commerce/orders/seller?storeSlug=xxx — seller's incoming orders
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { prisma } from '../../../utils/db'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const query = getQuery(event)
    const storeSlug = query.storeSlug as string
    const status = query.status as string | undefined
    const limit = Math.min(Number(query.limit) || 20, 100)
    const offset = Number(query.offset) || 0

    if (!storeSlug) throw new UserError('INVALID', 'storeSlug is required', 400)

    // Verify ownership
    const seller = await prisma.sellerProfile.findUnique({ where: { store_slug: storeSlug } })
    if (!seller) throw new UserError('NOT_FOUND', 'Store not found', 404)
    if (seller.profileId !== user.id) throw new UserError('FORBIDDEN', 'Access denied', 403)

    const where: any = {
      orderItem: {
        some: { variant: { product: { sellerId: seller.id } } }
      }
    }
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        include: {
          orderItem: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      seller: { select: { store_name: true, store_slug: true } },
                      media: { select: { id: true, url: true, type: true }, take: 1 }
                    }
                  }
                }
              }
            }
          },
          user: { select: { id: true, username: true, avatar: true, email: true } }
        },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.orders.count({ where }),
    ])

    return { success: true, data: { orders, total, limit, offset } }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
