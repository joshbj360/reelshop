import { storyRepository } from '../repositories/story.repository'
import { auditService } from '../../shared/audit/audit.service'
import { UserError } from '../../profile/types/user.types'

export const storyService = {
  async createStory(
    authorId: string,
    mediaId: string,
    productId?: number,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const story = await storyRepository.createStory(
      authorId,
      mediaId,
      productId,
    )

    await auditService.logUserAction({
      userId: authorId,
      action: 'STORY_CREATED',
      resource: 'Story',
      resourceId: story.id,
      reason: 'Created new story',
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
    })

    return story
  },

  async getStories(userId?: string, limit = 50) {
    if (userId) {
      return storyRepository.getActiveStoriesForUser(userId, limit)
    }
    return storyRepository.getActiveStories(limit)
  },

  async getMyStories(authorId: string) {
    return storyRepository.getMyStories(authorId)
  },

  async deleteStory(
    id: string,
    authorId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const story = await storyRepository.getStoryById(id)
    if (!story) throw new UserError('STORY_NOT_FOUND', 'Story not found', 404)
    if (story.authorId !== authorId)
      throw new UserError(
        'FORBIDDEN',
        'You can only delete your own stories',
        403,
      )

    await storyRepository.deleteStory(id)

    await auditService.logUserAction({
      userId: authorId,
      action: 'STORY_DELETED',
      resource: 'Story',
      resourceId: id,
      reason: 'Deleted story',
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
    })

    return { success: true }
  },
}
