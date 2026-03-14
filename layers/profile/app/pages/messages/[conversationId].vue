<template>
  <HomeLayout :hide-right-sidebar="true">
    <div
      class="mx-auto flex h-[calc(100vh-6rem)] max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      <!-- Chat Header -->
      <div
        class="flex shrink-0 items-center gap-3 border-b border-gray-200 p-4 dark:border-neutral-800"
      >
        <NuxtLink
          to="/messages"
          class="mr-1 text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <Icon name="mdi:arrow-left" size="22" />
        </NuxtLink>
        <NuxtLink
          v-if="otherUser"
          :to="`/profile/${otherUser.username}`"
          class="flex min-w-0 flex-1 items-center gap-3"
        >
          <img
            :src="
              otherUser.avatar ||
              `https://ui-avatars.com/api/?name=${otherUser.username}&background=f02c56&color=fff`
            "
            :alt="otherUser.username"
            class="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <p class="truncate font-semibold text-gray-900 dark:text-neutral-100">
            {{ otherUser.username }}
          </p>
        </NuxtLink>
        <div v-else class="flex flex-1 items-center gap-3">
          <div
            class="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700"
          />
          <div
            class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-700"
          />
        </div>
      </div>

      <!-- Messages Area -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-neutral-900"
      >
        <div
          v-if="isLoading && !messages.length"
          class="flex h-full items-center justify-center"
        >
          <Icon name="eos-icons:loading" size="32" class="text-brand" />
        </div>
        <div
          v-else-if="messages.length === 0"
          class="flex h-full flex-col items-center justify-center text-gray-500 dark:text-neutral-400"
        >
          <Icon name="mdi:message-outline" size="48" class="mb-3" />
          <p>No messages yet. Say hi! 👋</p>
        </div>
        <div v-else>
          <MessageBubble
            v-for="(message, index) in messages"
            :key="message.id"
            :message="message"
            :show-avatar="shouldShowAvatar(index)"
          />
        </div>
      </div>

      <!-- Message Input -->
      <div
        class="shrink-0 border-t border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <form @submit.prevent="handleSend" class="flex items-center gap-2">
          <input
            v-model="messageText"
            type="text"
            placeholder="Message..."
            class="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            @keydown.enter.exact.prevent="handleSend"
          />
          <button
            type="submit"
            :disabled="!messageText.trim() || isSending"
            class="px-2 text-sm font-semibold text-brand disabled:opacity-40"
          >
            <Icon v-if="isSending" name="eos-icons:loading" size="20" />
            <span v-else>Send</span>
          </button>
        </form>
      </div>
    </div>
  </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import MessageBubble from '../../components/MessageBubble.vue'
import { useChatStore } from '~~/layers/profile/app/stores/chat.store'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const chatStore = useChatStore()
const { fetchConversations, fetchMessages, sendMessage, isLoading } = useChat()

const conversationId = computed(() => route.params.conversationId as string)
const conversation = computed(() =>
  chatStore.getConversationById(conversationId.value),
)
const messages = computed(() =>
  chatStore.getConversationMessages(conversationId.value),
)
const otherUser = computed(() => conversation.value?.otherUser)

const messageText = ref('')
const isSending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(messages, scrollToBottom)

onMounted(async () => {
  // Ensure conversations are loaded (so we can resolve otherUser)
  if (!chatStore.conversations.length) {
    await fetchConversations()
  }
  await fetchMessages(conversationId.value)
  scrollToBottom()
})

// Reload messages when navigating to a different conversation
watch(conversationId, async (id) => {
  if (id) {
    await fetchMessages(id)
    scrollToBottom()
  }
})

const shouldShowAvatar = (index: number) => {
  if (index === 0) return true
  return messages.value[index].senderId !== messages.value[index - 1].senderId
}

const handleSend = async () => {
  const text = messageText.value.trim()
  if (!text) return
  isSending.value = true
  messageText.value = ''
  try {
    await sendMessage(conversationId.value, text)
    scrollToBottom()
  } catch {
    messageText.value = text // restore on failure
  } finally {
    isSending.value = false
  }
}
</script>
