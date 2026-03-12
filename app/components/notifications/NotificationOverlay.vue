<template>
    <Teleport to="body">
        <Transition name="slide-left">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/20 md:hidden" @click="$emit('close')" />

                <!-- Panel -->
                <div class="relative ml-auto w-full md:w-96 h-full bg-white dark:bg-neutral-950 border-l border-gray-200 dark:border-neutral-800 flex flex-col">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 dark:border-neutral-800 shrink-0">
                        <div class="flex items-center gap-2">
                            <button @click="$emit('close')" class="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                                <Icon name="mdi:arrow-left" size="22" />
                            </button>
                            <h2 class="text-base font-semibold text-gray-900 dark:text-neutral-100">Notifications</h2>
                            <span v-if="unreadCount > 0" class="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{{ unreadCount }}</span>
                        </div>
                        <button
                            v-if="unreadCount > 0"
                            @click="handleMarkAllRead"
                            class="text-brand text-sm font-semibold hover:opacity-75 transition-opacity"
                        >
                            Mark all read
                        </button>
                    </div>

                    <!-- List -->
                    <div class="flex-1 overflow-y-auto">
                        <!-- Skeleton -->
                        <div v-if="isLoading && !notifications.length" class="p-4 space-y-4">
                            <div v-for="i in 6" :key="i" class="flex gap-3 animate-pulse">
                                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0" />
                                <div class="flex-1 space-y-2 pt-1">
                                    <div class="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-4/5" />
                                    <div class="h-2.5 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
                                </div>
                            </div>
                        </div>

                        <!-- Items -->
                        <template v-else-if="notifications.length > 0">
                            <button
                                v-for="notif in notifications"
                                :key="notif.id"
                                @click="handleNotifClick(notif)"
                                class="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors text-left border-b border-gray-100 dark:border-neutral-800/50"
                                :class="{ 'bg-brand/5 dark:bg-brand/10': !notif.read }"
                            >
                                <!-- Avatar -->
                                <div class="relative shrink-0">
                                    <img
                                        v-if="notif.actor?.avatar"
                                        :src="notif.actor.avatar"
                                        class="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600 flex items-center justify-center">
                                        <Icon :name="typeIcon(notif.type)" size="18" class="text-white" />
                                    </div>
                                    <span class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center ring-1 ring-gray-200 dark:ring-neutral-800">
                                        <Icon :name="typeIcon(notif.type)" size="11" class="text-brand" />
                                    </span>
                                </div>

                                <!-- Text -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 dark:text-neutral-100 leading-snug" :class="{ 'font-semibold': !notif.read }">
                                        {{ notif.message }}
                                    </p>
                                    <p class="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5">
                                        {{ timeAgo(notif.created_at) }}
                                    </p>
                                </div>

                                <!-- Unread dot -->
                                <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                            </button>

                            <!-- Load more -->
                            <div v-if="hasMore" class="p-4 text-center">
                                <button
                                    @click="loadMore"
                                    :disabled="isLoading"
                                    class="text-sm text-brand font-medium hover:underline disabled:opacity-50"
                                >{{ isLoading ? 'Loading…' : 'Load more' }}</button>
                            </div>
                        </template>

                        <!-- Empty -->
                        <div v-else class="flex flex-col items-center justify-center h-full px-6 py-20 text-center">
                            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                                <Icon name="mdi:bell-outline" size="32" class="text-gray-400 dark:text-neutral-500" />
                            </div>
                            <p class="font-medium text-gray-900 dark:text-neutral-100">All caught up!</p>
                            <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">New activity will appear here</p>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~~/layers/profile/app/stores/notification.store'
import { useNotificationApi } from '~~/layers/profile/app/services/notification.api'

const props = defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const api = useNotificationApi()
const store = useNotificationStore()

const isLoading = ref(false)
const offset = ref(0)
const total = ref(0)
const LIMIT = 20

const notifications = computed(() => store.notifications)
const unreadCount = computed(() => store.unreadCount)
const hasMore = computed(() => notifications.value.length < total.value)

const load = async (reset = false) => {
    if (isLoading.value) return
    isLoading.value = true
    try {
        if (reset) { store.clearNotifications(); offset.value = 0 }
        const res: any = await api.getNotifications(LIMIT, offset.value)
        const items = res?.data?.notifications || []
        total.value = res?.data?.total || 0
        if (reset) {
            store.setNotifications(items)
        } else {
            items.forEach((n: any) => store.addNotification(n))
        }
        offset.value += items.length
    } catch { /* non-fatal */ } finally {
        isLoading.value = false
    }
}

const loadMore = () => load(false)

const handleNotifClick = async (notif: any) => {
    if (notif.read) return
    try {
        await api.markAsRead(notif.id)
        store.markAsRead(notif.id)
    } catch { /* silent */ }
}

const handleMarkAllRead = async () => {
    try {
        await api.markAllAsRead()
        store.setNotifications(notifications.value.map(n => ({ ...n, read: true })))
    } catch { /* silent */ }
}

const typeIcon = (type: string) => ({
    POST_LIKE: 'mdi:heart',
    NEW_COMMENT: 'mdi:comment-outline',
    REPLY: 'mdi:comment-text-outline',
    NEW_FOLLOWER: 'mdi:account-plus-outline',
    COMMENT_LIKE: 'mdi:heart-outline',
    ORDER: 'mdi:package-variant-closed',
    GENERAL: 'mdi:bell-outline',
    NEW_POST: 'mdi:image-outline',
    PRODUCT_SHARE: 'mdi:share-outline',
    REVIEW: 'mdi:star-outline',
}[type] || 'mdi:bell-outline')

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const s = Math.floor(diff / 1000)
    if (s < 60) return 'Just now'
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d ago`
    return new Date(dateStr).toLocaleDateString()
}

watch(() => props.isOpen, open => { if (open) load(true) })
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active { transition: opacity 0.2s ease; }
.slide-left-enter-active > div:last-child,
.slide-left-leave-active > div:last-child { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-left-enter-from > div:last-child,
.slide-left-leave-to > div:last-child { transform: translateX(100%); }
.slide-left-enter-from, .slide-left-leave-to { opacity: 0; }
</style>
