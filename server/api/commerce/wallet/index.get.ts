// GET /api/commerce/wallet
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { walletService } from '../../../layers/commerce/services/wallet.service'
import { UserError } from '../../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const sellerProfile = user.sellerProfile
    if (!sellerProfile)
      throw new UserError(
        'SELLER_REQUIRED',
        'A seller profile is required',
        403,
      )
    const result = await walletService.getWallet(sellerProfile.id)
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
