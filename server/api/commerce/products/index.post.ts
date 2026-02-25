// POST /api/commerce/products
import { getClientIP } from '../../../layers/shared/utils/security'
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { productService } from '../../../layers/commerce/services/product.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const ipAddress = getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'

    const sellerProfile = user.sellerProfile
    if (!sellerProfile) throw new UserError('SELLER_REQUIRED', 'A seller profile is required to create products', 403)

    const result = await productService.createProduct(
      sellerProfile.id,
      sellerProfile.store_slug,
      body,
      ipAddress,
      userAgent
    )
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
