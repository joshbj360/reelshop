// server/layers/feed/services/feed.service.ts

/**
 * Feed Service
 * Aggregates Posts and Products for Home and Personalized feeds
 */

import { postRepository } from '../../posts/repositories/post.repository'

import type { IFeedOptions } from '../../../../layers/feed/app/types/feed.types'
import { normalizePost, normalizeProduct } from '../utils/feed.utils'
import { socialRepository } from '../../profile/repositories/social.repository'
import { OrderStatus } from '@prisma/client'
import { productRepository } from '../../commerce/repositories/product.repository'

export const feedService = {
  /**
   * Get home feed (aggregates posts and products)
   */
  async getHomeFeed(options: IFeedOptions) {
    const { limit = 20, offset = 0 } = options
    const half = Math.ceil(limit / 2)

    // Fetch posts, products, and total count all in parallel
    const [posts, products, total] = await Promise.all([
      postRepository.getPosts({
        take: half,
        skip: offset,
        orderBy: { created_at: 'desc' },
      }),
      productRepository.getProducts(
        { status: 'PUBLISHED' },
        { limit: half, offset },
      ),
      this.getTotalCount(),
    ])

    // Normalize, merge and sort by date
    const items = [
      ...posts.map(normalizePost),
      ...products.map(normalizeProduct),
    ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)

    return {
      items,
      meta: { total, limit, offset, hasMore: items.length === limit },
    }
  },

  /**
   * Get following feed (posts from followed users/sellers)
   */
  async getFollowingFeed(userId: string, options: IFeedOptions) {
    const { limit = 20, offset = 0 } = options

    // 1. Get followed entities (Users and Sellers)
    const follows = await socialRepository.getFollowing({
      userId,
      limit: 1000,
      offset: 0,
    })

    if (!follows || follows.length === 0) {
      return { items: [], meta: { total: 0, limit, offset, hasMore: false } }
    }

    // 2. Extract strictly the IDs for the query
    const followingIds = follows.map((f) => f.id)

    // 3. Fetch posts from those specific IDs
    // Note: We prioritize Posts for the following feed to keep it social
    const posts = await postRepository.getPostsByAuthorIds(followingIds, {
      take: limit,
      skip: offset,
    })
    const items = posts.map(normalizePost)

    return {
      items,
      meta: {
        total: posts.length,
        limit,
        offset,
        hasMore: items.length === limit,
      },
    }
  },

  /**
   * Utility to get combined total count
   */
  async getTotalCount() {
    try {
      const [postsCount, productsCount] = await Promise.all([
        postRepository.count(),
        productRepository.countProducts({ status: 'PUBLISHED' }), // Only count published products for feed
      ])
      return postsCount + productsCount
    } catch (e) {
      return 0 // Fallback for meta stats
    }
  },
}
