// DELETE /api/commerce/cart/:variantId - Remove cart item
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { cartService } from '../../../layers/commerce/services/cart.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const variantId = parseInt(getRouterParam(event, 'variantId') || '')
    if (isNaN(variantId)) throw new UserError('INVALID_ID', 'variantId must be a number', 400)
    await cartService.removeFromCart(user.id, variantId)
    return { success: true }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
