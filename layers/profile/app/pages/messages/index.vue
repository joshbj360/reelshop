<template>
    <HomeLayout :hide-right-sidebar="true">
        <div class="max-w-2xl mx-auto">
            <div class="bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                <!-- Header -->
                <div class="p-4 border-b border-gray-200 dark:border-neutral-800">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-neutral-100">Messages</h2>
                        <NuxtLink to="/messages/new" class="text-brand hover:text-[#d81b36]">
                            <Icon name="mdi:pencil-outline" size="24" />
                        </NuxtLink>
                    </div>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search messages..."
                        class="w-full px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
                    />
                </div>

                <!-- Conversations List -->
                <div class="min-h-[60vh]">
                    <div v-if="isLoading" class="flex items-center justify-center py-20">
                        <Icon name="eos-icons:loading" size="32" class="text-brand" />
                    </div>
                    <div v-else-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-neutral-400">
                        <Icon name="mdi:message-outline" size="48" class="mb-3" />
                        <p>No messages yet</p>
                        <NuxtLink to="/messages/new" class="text-brand hover:underline mt-2 text-sm">
                            Start a conversation
                        </NuxtLink>
                    </div>
                    <div v-else>
                        <ConversationItem
                            v-for="conversation in filteredConversations"
                            :key="conversation.id"
                            :conversation="conversation"
                        />
                    </div>
                </div>
            </div>
        </div>
    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import ConversationItem from '../../components/ConversationItem.vue'

definePageMeta({ middleware: 'auth' })

const { fetchConversations, isLoading, conversations } = useChat()
const searchQuery = ref('')

const filteredConversations = computed(() => {
    if (!searchQuery.value) return conversations.value
    const q = searchQuery.value.toLowerCase()
    return conversations.value.filter(c =>
        c.otherUser?.username?.toLowerCase().includes(q) ||
        c.otherUser?.name?.toLowerCase().includes(q)
    )
})

onMounted(() => {
    fetchConversations()
})
</script>
