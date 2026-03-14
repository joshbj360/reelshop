// GET /api/seller/:id/products  (id = store slug)
import { optionalAuth } from '../../../layers/shared/middleware/requireAuth'
import { productService } from '../../../layers/commerce/services/product.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await optionalAuth(event)
    const storeSlug = getRouterParam(event, 'id') || ''
    const query = getQuery(event)
    const limit = Math.min(Number(query.limit) || 20, 100)
    const offset = Number(query.offset) || 0

    // Only the owning seller sees non-PUBLISHED products
    const isOwner = currentUser?.sellerProfile?.store_slug === storeSlug
    const status = isOwner ? (query.status as string | undefined) : 'PUBLISHED'

    const result = await productService.getSellerProducts(
      storeSlug,
      { limit, offset },
      status,
    )
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError)
      throw createError({
        statusCode: error.status,
        statusMessage: error.message,
      })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
