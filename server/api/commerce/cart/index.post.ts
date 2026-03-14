// POST /api/commerce/cart - Add item to cart
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { cartService } from '../../../layers/commerce/services/cart.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { variantId, quantity = 1 } = body
    if (!variantId)
      throw new UserError('INVALID_INPUT', 'variantId is required', 400)
    const result = await cartService.addToCart(
      user.id,
      Number(variantId),
      Number(quantity),
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
