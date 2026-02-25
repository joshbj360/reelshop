import { prisma } from '../../../utils/db'

const storyInclude = {
  author: {
    select: { id: true, username: true, avatar: true }
  },
  media: {
    select: { id: true, url: true, type: true }
  },
  product: {
    select: { id: true, title: true, price: true, bannerImageUrl: true }
  }
}

export const storyRepository = {
  async createStory(authorId: string, mediaId: string, productId?: number) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    return prisma.story.create({
      data: {
        authorId,
        mediaId,
        expiresAt,
        ...(productId ? { productId } : {})
      },
      include: storyInclude
    })
  },

  async getActiveStories(limit = 50) {
    return prisma.story.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: storyInclude,
      orderBy: { created_at: 'desc' },
      take: limit
    })
  },

  async getActiveStoriesForUser(userId: string, limit = 50) {
    // Get stories from followed users + own stories
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    })
    const followingIds = [userId, ...following.map(f => f.followingId)]

    return prisma.story.findMany({
      where: {
        authorId: { in: followingIds },
        expiresAt: { gt: new Date() }
      },
      include: storyInclude,
      orderBy: { created_at: 'desc' },
      take: limit
    })
  },

  async getMyStories(authorId: string) {
    return prisma.story.findMany({
      where: { authorId },
      include: storyInclude,
      orderBy: { created_at: 'desc' }
    })
  },

  async getStoryById(id: string) {
    return prisma.story.findUnique({ where: { id }, include: storyInclude })
  },

  async deleteStory(id: string) {
    return prisma.story.delete({ where: { id } })
  },

  async deleteExpiredStories() {
    return prisma.story.deleteMany({ where: { expiresAt: { lte: new Date() } } })
  }
}
