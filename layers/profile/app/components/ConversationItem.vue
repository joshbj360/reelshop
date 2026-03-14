<template>
    <NuxtLink
        :to="`/messages/${conversation.id}`"
        class="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors border-b border-gray-100 dark:border-neutral-800"
        :class="{ 'bg-gray-50 dark:bg-neutral-900': isActive }"
    >
        <!-- Avatar -->
        <div class="relative shrink-0">
            <img
                :src="conversation.otherUser?.avatar || `https://ui-avatars.com/api/?name=${conversation.otherUser?.username}&background=f02c56&color=fff`"
                :alt="conversation.otherUser?.username"
                class="w-14 h-14 rounded-full object-cover"
            />
        </div>

        <!-- Message Info -->
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
                <p class="font-semibold text-gray-900 dark:text-neutral-100 truncate">
                    {{ conversation.otherUser?.username || conversation.otherUser?.name || 'Unknown' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400 shrink-0 ml-2">
                    {{ formatTime(conversation.updated_at) }}
                </p>
            </div>
            <p class="text-sm text-gray-600 dark:text-neutral-400 truncate">
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
