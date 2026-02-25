// GET /api/commerce/wallet/transactions
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { walletService } from '../../../layers/commerce/services/wallet.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const sellerProfile = user.sellerProfile
    if (!sellerProfile) throw new UserError('SELLER_REQUIRED', 'A seller profile is required', 403)
    const query = getQuery(event)
    const limit = Math.min(Number(query.limit) || 20, 100)
    const offset = Number(query.offset) || 0
    const result = await walletService.getTransactions(sellerProfile.id, limit, offset)
    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
