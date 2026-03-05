// POST /api/commerce/products
import { ZodError } from 'zod'
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

    // If storeSlug is provided, resolve that specific seller profile
    let sellerProfile = user.sellerProfile
    if (body.storeSlug && body.storeSlug !== sellerProfile?.store_slug) {
      const match = await prisma.sellerProfile.findFirst({
        where: { store_slug: body.storeSlug, profileId: user.id, is_active: true }
      })
      if (!match) throw new UserError('SELLER_NOT_FOUND', 'Seller profile not found or not active', 404)
      sellerProfile = match as any
    }
    if (!sellerProfile) throw new UserError('SELLER_REQUIRED', 'A seller profile is required to create products', 403)

    const { storeSlug: _slug, ...productBody } = body
    const result = await productService.createProduct(
      sellerProfile.id,
      sellerProfile.store_slug,
      productBody,
      ipAddress,
      userAgent,
      user.id
    )
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    if (error instanceof ZodError) throw createError({ statusCode: 422, statusMessage: error.errors[0]?.message ?? 'Validation error' })
    console.error('[POST /api/commerce/products]', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
