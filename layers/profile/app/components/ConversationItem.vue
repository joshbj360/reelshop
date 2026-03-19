<template>
  <NuxtLink
    :to="`/messages/${conversation.id}`"
    class="flex items-center gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
    :class="{ 'bg-gray-50 dark:bg-neutral-900': isActive }"
  >
    <!-- Avatar -->
    <div class="relative shrink-0">
      <Avatar
        :username="conversation.otherUser?.username ?? 'User'"
        :avatar="conversation.otherUser?.avatar ?? ''"
        size="xl"
      />
    </div>

    <!-- Message Info -->
    <div class="min-w-0 flex-1">
      <div class="mb-1 flex items-center justify-between">
        <p class="truncate font-semibold text-gray-900 dark:text-neutral-100">
          {{
            conversation.otherUser?.username ||
            conversation.otherUser?.name ||
            'Unknown'
          }}
        </p>
        <p class="ml-2 shrink-0 text-xs text-gray-500 dark:text-neutral-400">
          {{ formatTime(conversation.updated_at) }}
        </p>
      </div>
      <p class="truncate text-sm text-gray-600 dark:text-neutral-400">
        Start a conversation...
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { IConversation } from '../types/profile.types'

defineProps<{
  conversation: IConversation
  isActive?: boolean
}>()

const formatTime = (date?: string | null) => {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return d.toLocaleDateString()
}
</script>
