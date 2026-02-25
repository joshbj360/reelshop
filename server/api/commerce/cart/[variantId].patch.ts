// PATCH /api/commerce/cart/:variantId - Update cart item quantity
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { cartService } from '../../../layers/commerce/services/cart.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const variantId = parseInt(getRouterParam(event, 'variantId') || '')
    if (isNaN(variantId)) throw new UserError('INVALID_ID', 'variantId must be a number', 400)
    const body = await readBody(event)
    const { quantity } = body
    if (!quantity) throw new UserError('INVALID_INPUT', 'quantity is required', 400)
    const result = await cartService.updateQuantity(user.id, variantId, Number(quantity))
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
