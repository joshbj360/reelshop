import { useChatApi } from '../services/chat.api'
import { useChatStore } from '../stores/chat.store'
import { useProfileStore } from '../stores/profile.store'
import { useAuthStore } from '~~/layers/base/app/stores/auth.store'
import type { IConversation, IMessage } from '../types/profile.types'

// Normalize a raw server conversation into IConversation with `otherUser`
function normalizeConversation(raw: any, currentUserId: string): IConversation {
  const otherUser =
    raw.participant1Id === currentUserId
      ? raw.participant2 ?? null
      : raw.participant1 ?? null
  return { ...raw, otherUser }
}

// ─── WebSocket singleton ──────────────────────────────────────────────────────
// One socket shared across the whole app. We don't want a new socket every time
// a component uses useChat().
let socket: WebSocket | null = null
let pingInterval: ReturnType<typeof setInterval> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let isIntentionallyClosed = false

export const useChat = () => {
  const chatApi = useChatApi()
  const chatStore = useChatStore()
  const profileStore = useProfileStore()
  const authStore = useAuthStore()

  const isLoading = computed(() => chatStore.isLoading)
  const error = computed(() => chatStore.error)
  const conversations = computed(() => chatStore.conversations)

  // ─── WebSocket connection ─────────────────────────────────────────────────

  /**
   * Open the WebSocket connection to the server.
   * Call this once when the user logs in (from the messages page or layout).
   */
  const connectSocket = () => {
    if (!import.meta.client) return
    if (socket?.readyState === WebSocket.OPEN) return // already connected

    const token = authStore.accessToken
    if (!token) return

    isIntentionallyClosed = false

    // Build the WebSocket URL — same host, different protocol (ws:// or wss://)
    const base = window.location.origin.replace(/^http/, 'ws')
    const url = `${base}/api/chat/ws?token=${encodeURIComponent(token)}`

    socket = new WebSocket(url)

    // ── Connected ────────────────────────────────────────────────────────────
    socket.onopen = () => {
      console.log('[Chat] WebSocket connected')
      // Send a ping every 20s to prevent idle timeout
      pingInterval = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, 20_000)
    }

    // ── Incoming message from server ─────────────────────────────────────────
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'new_message') {
          // Someone sent US a message → add it to the store immediately
          chatStore.addConversationMessage(data.conversationId, data.message)
          // Also bump the conversation to the top of the list
          chatStore.bumpConversation(data.conversationId, data.message)
        }

        if (data.type === 'message_sent') {
          // Echo from our own message on another device/tab — ignore if already added
          const existing = chatStore.getMessageById(data.message.id)
          if (!existing) {
            chatStore.addConversationMessage(data.conversationId, data.message)
          }
        }
      } catch {
        // Ignore malformed frames
      }
    }

    // ── Disconnected ─────────────────────────────────────────────────────────
    socket.onclose = () => {
      if (pingInterval) clearInterval(pingInterval)
      socket = null

      // Auto-reconnect after 3 seconds unless we deliberately closed it
      if (!isIntentionallyClosed && authStore.accessToken) {
        reconnectTimer = setTimeout(connectSocket, 3_000)
      }
    }

    socket.onerror = () => {
      socket?.close()
    }
  }

  /**
   * Close the WebSocket when the user logs out.
   */
  const disconnectSocket = () => {
    isIntentionallyClosed = true
    if (pingInterval) clearInterval(pingInterval)
    if (reconnectTimer) clearTimeout(reconnectTimer)
    socket?.close()
    socket = null
  }

  // ─── Existing HTTP methods (unchanged) ───────────────────────────────────

  const fetchConversations = async () => {
    chatStore.setLoading(true)
    chatStore.setError(null)
    try {
      const res = await chatApi.getConversations()
      const raw: any[] = res?.data?.conversations ?? []
      const userId = profileStore.userId ?? ''
      const normalized = raw.map((c) => normalizeConversation(c, userId))
      chatStore.setConversations(normalized)
      return normalized
    } catch (err: any) {
      chatStore.setError(err.message || 'Failed to fetch conversations')
      throw err
    } finally {
      chatStore.setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    chatStore.setLoading(true)
    chatStore.setError(null)
    try {
      const res = await chatApi.getMessages(conversationId)
      const msgs: IMessage[] = res?.data?.messages ?? []
      chatStore.setConversationMessages(conversationId, msgs)
      return msgs
    } catch (err: any) {
      chatStore.setError(err.message || 'Failed to fetch messages')
      throw err
    } finally {
      chatStore.setLoading(false)
    }
  }

  const sendMessage = async (conversationId: string, text: string) => {
    try {
      const res = await chatApi.sendMessage(conversationId, text)
      const msg: IMessage = res?.data ?? res
      // Optimistically add to store immediately (sender sees it right away)
      chatStore.addConversationMessage(conversationId, msg)
      chatStore.bumpConversation(conversationId, msg)
      return msg
    } catch (err: any) {
      chatStore.setError(err.message || 'Failed to send message')
      throw err
    }
  }

  const createConversation = async (targetId: string) => {
    try {
      const res = await chatApi.createConversation(targetId)
      const raw = res?.data ?? res
      const userId = profileStore.userId ?? ''
      const normalized = normalizeConversation(raw, userId)
      if (!chatStore.getConversationById(normalized.id)) {
        chatStore.addConversation(normalized)
      }
      return normalized
    } catch (err: any) {
      chatStore.setError(err.message || 'Failed to create conversation')
      throw err
    }
  }

  return {
    isLoading,
    error,
    conversations,
    connectSocket,
    disconnectSocket,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
  }
}
