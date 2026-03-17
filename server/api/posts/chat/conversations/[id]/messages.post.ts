// POST /api/posts/chat/conversations/[id]/messages - Send message
import { getClientIP } from '../../../../../layers/shared/utils/security'
import { requireAuth } from '../../../../../layers/shared/middleware/requireAuth'
import { UserError } from '../../../../../layers/profile/types/user.types'
import { chatService } from '../../../../../layers/profile/services/chat.service'
import { chatConnections } from '~~/server/utils/connections'
import { prisma } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const id = getRouterParam(event, 'id')
    if (!id) throw new UserError('INVALID_ID', 'ID is required', 400)

    const body = await readBody(event)

    const ipAddress =
      getHeader(event, 'x-forwarded-for') || getClientIP(event) || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'

    const result = await chatService.sendMessage(
      id,
      user.id,
      body.text,
      body.type,
      ipAddress,
      userAgent,
    )

    // ── Real-time push ────────────────────────────────────────────────────────
    // Find who the other person in this conversation is
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { participant1Id: true, participant2Id: true },
    })

    if (conversation) {
      const recipientId =
        conversation.participant1Id === user.id
          ? conversation.participant2Id
          : conversation.participant1Id

      // Push to recipient if they have an open WebSocket connection
      chatConnections.send(recipientId, {
        type: 'new_message',
        conversationId: id,
        message: result,
      })

      // Also echo back to the sender's other devices/tabs
      chatConnections.send(user.id, {
        type: 'message_sent',
        conversationId: id,
        message: result,
      })
    }
    // ─────────────────────────────────────────────────────────────────────────

    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof UserError) {
      throw createError({
        statusCode: error.status,
        statusMessage: error.message,
      })
    }
    throw createError({ statusCode: 500, statusMessage: 'Server error' })
  }
})
