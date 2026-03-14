import { defineEventHandler, getValidatedQuery, createError } from 'h3'
import { z, ZodError } from 'zod'
import { feedService } from '~~/server/layers/feed/services/feed.services'

// Safely parse and convert query strings to numbers
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
  type: z.enum(['all', 'posts', 'products']).default('all').optional(),
})

export default defineEventHandler(async (event) => {
  try {
    // 1. Validate Query Params (Throws 400 automatically if invalid)
    const query = await getValidatedQuery(event, (data) =>
      querySchema.parse(data),
    )

    // 2. Extract Context (Optional User Auth)
    const userId = event.context.user?.id

    // 3. Call your existing Feed Service
    // We pass limit and offset as per your IFeedOptions interface
    const feed = await feedService.getHomeFeed({
      limit: query.limit,
      offset: query.offset,
      // If your IFeedOptions supports 'type', you can pass it here:
      type: query.type,
    })

    return feed
  } catch (error: any) {
    // Handle Validation Errors safely
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query parameters',
        data: error.errors,
      })
    }

    console.error('[Home Feed API] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch feed',
    })
  }
})
