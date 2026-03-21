// POST /api/user/posts - Create post
import { getClientIP } from '../../layers/shared/utils/security'
import { requireAuth } from '../../layers/shared/middleware/requireAuth'
import { contentService } from '../../layers/posts/services/post.service'
import { UserError } from '../../layers/profile/types/user.types'
import { bust, setCreatorBypass } from '../../utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const body = await readBody(event)

    const ipAddress =
      getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'

    if (body.mediaData && !Array.isArray(body.mediaData)) {
      throw new UserError('INVALID_MEDIA', 'mediaData must be an array', 400)
    }
    const result = await contentService.createPost(
      user.id,
      body,
      ipAddress,
      userAgent,
    )

    // Bust discover feed pages + set creator bypass so they see post immediately
    await Promise.all([
      bust('feed:home:page:*'),
      bust('feed:discover:page:*'),
      bust(`feed:following:user:${user.id}:page:*`),
      setCreatorBypass(user.id),
    ])

    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) {
      throw createError({
        statusCode: error.status,
        statusMessage: error.message,
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
