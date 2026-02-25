// GET /api/commerce/affiliate - Get affiliate status and stats
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { UserError } from '../../../layers/profile/types/user.types'
import { prisma } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    // Check if user has affiliate_code field in profile (graceful fallback)
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { id: true, username: true }
    })

    if (!profile) throw new UserError('NOT_FOUND', 'Profile not found', 404)

    // Return empty/unenrolled state — affiliate model to be added in future migration
    return {
      success: true,
      data: {
        isEnrolled: false,
        affiliateCode: null,
        stats: {
          totalEarnings: 0,
          pendingEarnings: 0,
          totalClicks: 0,
          totalConversions: 0,
          conversionRate: 0
        }
      }
    }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
