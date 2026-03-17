<template>
  <div
    class="mb-4 flex"
    :class="isOwnMessage ? 'justify-end' : 'justify-start'"
  >
    <!-- Other User Avatar -->
    <img
      v-if="!isOwnMessage && showAvatar"
      :src="
        message.sender?.avatar ||
        `https://ui-avatars.com/api/?name=${message.sender?.username}&background=f02c56&color=fff`
      "
      :alt="message.sender?.username"
      class="mr-2 h-8 w-8 shrink-0 rounded-full object-cover"
    />
    <div v-else-if="!isOwnMessage" class="mr-2 w-8"></div>

    <!-- Message Content -->
    <div
      class="max-w-[70%] rounded-2xl px-4 py-2"
      :class="
        isOwnMessage
          ? 'rounded-br-sm bg-brand text-white'
          : 'rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-neutral-100'
      "
    >
      <p class="whitespace-pre-wrap break-words text-sm">
        {{ message.content }}
      </p>
      <p
        class="mt-1 text-xs"
        :class="
          isOwnMessage ? 'text-white/70' : 'text-gray-500 dark:text-neutral-400'
        "
      >
        {{ formatTime(message.sentAt) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IMessage } from '../types/profile.types'
import { useProfileStore } from '../stores/profile.store'

const props = defineProps<{
  message: IMessage
  showAvatar?: boolean
}>()

const profileStore = useProfileStore()
const isOwnMessage = computed(
  () => props.message.senderId === profileStore.userId,
)

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
</script>
