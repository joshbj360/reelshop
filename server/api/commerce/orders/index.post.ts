// POST /api/commerce/orders - Place an order
import { getClientIP } from '../../../layers/shared/utils/security'
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { orderService } from '../../../layers/commerce/services/order.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const ipAddress = getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const result = await orderService.placeOrder(user.id, body, ipAddress, userAgent)
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
