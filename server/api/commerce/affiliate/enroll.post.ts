// POST /api/commerce/affiliate/enroll
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { UserError } from '../../../layers/profile/types/user.types'
import { auditService } from '../../../layers/shared/audit/audit.service'
import { getClientIP } from '../../../layers/shared/utils/security'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const ipAddress =
      getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'

    // Affiliate enrollment is pending full model migration
    // For now, log the intent and return a pending state
    await auditService.logUserAction({
      userId: user.id,
      action: 'AFFILIATE_ENROLL_REQUESTED',
      resource: 'AffiliateProfile',
      resourceId: user.id,
      reason: 'User requested affiliate enrollment',
      ipAddress,
      userAgent,
    })

    return {
      success: true,
      data: {
        isEnrolled: false,
        message:
          'Affiliate enrollment is being processed. You will be notified when approved.',
      },
    }
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
