<template>
    <button
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors border-b border-gray-100 dark:border-neutral-800 text-left"
        :disabled="isCreating"
        @click="$emit('select')"
    >
        <img
            :src="user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=f02c56&color=fff`"
            :alt="user.username"
            class="w-11 h-11 rounded-full object-cover shrink-0"
        />
        <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">{{ user.full_name || user.name || user.username }}</p>
            <p class="text-xs text-gray-500 dark:text-neutral-400">@{{ user.username }}</p>
        </div>
        <Icon v-if="isCreating" name="eos-icons:loading" size="18" class="text-brand shrink-0" />
        <Icon v-else name="mdi:message-outline" size="18" class="text-gray-300 dark:text-neutral-600 shrink-0" />
    </button>
</template>

<script setup lang="ts">
defineProps<{ user: any; isCreating?: boolean }>()
defineEmits(['select'])
</script>
