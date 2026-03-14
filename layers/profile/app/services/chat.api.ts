import { BaseApiClient } from '../../../base/app/services/base.api'
import type { IConversation, IMessage } from '../types/profile.types'

export class ChatApiClient extends BaseApiClient {
  async getConversations(limit: number = 20, offset: number = 0): Promise<any> {
    return this.request(
      `/api/posts/chat/conversations?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
    )
  }

  async createConversation(targetId: string): Promise<any> {
    return this.request('/api/posts/chat/conversations', {
      method: 'POST',
      body: { targetId },
    })
  }

  async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<any> {
    return this.request(
      `/api/posts/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
    )
  }

  async sendMessage(conversationId: string, text: string): Promise<any> {
    return this.request(
      `/api/posts/chat/conversations/${conversationId}/messages`,
      { method: 'POST', body: { text } },
    )
  }
}

let instance: ChatApiClient | null = null
export const useChatApi = () => {
  if (!instance) instance = new ChatApiClient()
  return instance
}
