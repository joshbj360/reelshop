// DELETE /api/stories/:id
import { getClientIP } from '../../layers/shared/utils/security'
import { requireAuth } from '../../layers/shared/middleware/requireAuth'
import { storyService } from '../../layers/posts/services/story.service'
import { UserError } from '../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const id = getRouterParam(event, 'id') || ''
    if (!id) throw new UserError('INVALID_ID', 'Story ID is required', 400)
    const ipAddress =
      getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    await storyService.deleteStory(id, user.id, ipAddress, userAgent)
    return { success: true }
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
