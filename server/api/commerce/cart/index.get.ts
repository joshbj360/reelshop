// GET /api/commerce/cart
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { cartService } from '../../../layers/commerce/services/cart.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const result = await cartService.getCart(user.id)
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
