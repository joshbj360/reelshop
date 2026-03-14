// POST /api/commerce/wallet/withdraw
import { getClientIP } from '../../../layers/shared/utils/security'
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
    const body = await readBody(event)
    const { amount, bankAccount } = body
    if (!amount || isNaN(Number(amount)))
      throw new UserError('INVALID_INPUT', 'amount is required', 400)
    if (!bankAccount)
      throw new UserError(
        'INVALID_INPUT',
        'bankAccount details are required',
        400,
      )
    const ipAddress =
      getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const result = await walletService.withdraw(
      sellerProfile.id,
      Number(amount),
      bankAccount,
      ipAddress,
      userAgent,
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
