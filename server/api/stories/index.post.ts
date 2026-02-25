// POST /api/stories - Create a story
import { getClientIP } from '../../layers/shared/utils/security'
import { requireAuth } from '../../layers/shared/middleware/requireAuth'
import { storyService } from '../../layers/posts/services/story.service'
import { UserError } from '../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { mediaId, productId } = body
    if (!mediaId) throw new UserError('INVALID_INPUT', 'mediaId is required', 400)
    const ipAddress = getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const story = await storyService.createStory(user.id, mediaId, productId ? Number(productId) : undefined, ipAddress, userAgent)
    return { success: true, data: story }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
