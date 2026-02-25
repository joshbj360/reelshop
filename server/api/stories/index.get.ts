// GET /api/stories - Get active stories
import { optionalAuth } from '../../layers/shared/middleware/requireAuth'
import { storyService } from '../../layers/posts/services/story.service'
import { UserError } from '../../layers/profile/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const user = await optionalAuth(event)
    const query = getQuery(event)
    const limit = Math.min(Number(query.limit) || 50, 100)
    const stories = await storyService.getStories(user?.id, limit)
    return { success: true, data: stories }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
