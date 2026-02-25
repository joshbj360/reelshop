// GET /api/commerce/orders/:id
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { orderService } from '../../../layers/commerce/services/order.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const id = parseInt(getRouterParam(event, 'id') || '')
    if (isNaN(id)) throw new UserError('INVALID_ID', 'Order ID must be a number', 400)
    const order = await orderService.getOrderById(id, user.id)
    return { success: true, data: order }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
