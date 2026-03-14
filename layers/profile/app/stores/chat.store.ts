import type { IConversation, IMessage } from '../types/profile.types'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<IConversation[]>([])
  const currentConversation = ref<IConversation | null>(null)
  const messagesByConversation = ref<Record<string, IMessage[]>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getConversationById = (id: string) => conversations.value.find(c => c.id === id)
  const getConversationMessages = (id: string): IMessage[] => messagesByConversation.value[id] ?? []

  const setConversations = (newConversations: IConversation[]) => { conversations.value = newConversations }
  const addConversation = (conversation: IConversation) => { conversations.value.unshift(conversation) }
  const setCurrentConversation = (conversation: IConversation | null) => { currentConversation.value = conversation }
  const deleteConversation = (id: string) => { conversations.value = conversations.value.filter(c => c.id !== id) }

  const setConversationMessages = (id: string, msgs: IMessage[]) => {
    messagesByConversation.value = { ...messagesByConversation.value, [id]: msgs }
  }
  const addConversationMessage = (id: string, msg: IMessage) => {
    const existing = messagesByConversation.value[id] ?? []
    messagesByConversation.value = { ...messagesByConversation.value, [id]: [...existing, msg] }
  }

  const setLoading = (loading: boolean) => { isLoading.value = loading }
  const setError = (err: string | null) => { error.value = err }
  const clearChat = () => {
    conversations.value = []
    messagesByConversation.value = {}
    currentConversation.value = null
  }

  return {
    conversations, currentConversation, messagesByConversation, isLoading, error,
    getConversationById, getConversationMessages,
    setConversations, addConversation, setCurrentConversation, deleteConversation,
    setConversationMessages, addConversationMessage,
    setLoading, setError, clearChat
  }
})
