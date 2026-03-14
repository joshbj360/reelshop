import { useChatApi } from '../services/chat.api'
import { useChatStore } from '../stores/chat.store'
import { useProfileStore } from '../stores/profile.store'
import type { IConversation, IMessage } from '../types/profile.types'

// Normalize a raw server conversation into IConversation with `otherUser`
function normalizeConversation(raw: any, currentUserId: string): IConversation {
  const otherUser =
    raw.participant1Id === currentUserId
      ? raw.participant2 ?? null
      : raw.participant1 ?? null
  return { ...raw, otherUser }
}

export const useChat = () => {
  const chatApi = useChatApi()
  const chatStore = useChatStore()
  const profileStore = useProfileStore()

  const isLoading = computed(() => chatStore.isLoading)
  const error = computed(() => chatStore.error)
  const conversations = computed(() => chatStore.conversations)

  const fetchConversations = async () => {
    chatStore.setLoading(true)
    chatStore.setError(null)
    try {
      const res = await chatApi.getConversations()
      // Server returns { success: true, data: { conversations: [...], total, limit, offset } }
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
      // Server returns { success: true, data: { messages: [...], total, limit, offset } }
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
      // Server returns { success: true, data: message }
      const msg: IMessage = res?.data ?? res
      chatStore.addConversationMessage(conversationId, msg)
      return msg
    } catch (err: any) {
      chatStore.setError(err.message || 'Failed to send message')
      throw err
    }
  }

  const createConversation = async (targetId: string) => {
    try {
      const res = await chatApi.createConversation(targetId)
      // Server returns { success: true, data: conversation }
      const raw = res?.data ?? res
      const userId = profileStore.userId ?? ''
      const normalized = normalizeConversation(raw, userId)
      // Only add to store if not already present
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
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
  }
}
