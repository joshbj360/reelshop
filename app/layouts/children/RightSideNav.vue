<template>
    <div class="flex flex-col h-full">

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">

            <!-- Welcome card -->
            <ClientOnly>
                <div
                    v-if="profileStore.isLoggedIn"
                    class="bg-gradient-to-br from-brand/5 to-purple-500/5 dark:from-brand/10 dark:to-purple-500/10 rounded-xl p-4 border border-brand/10"
                >
                    <div class="flex items-center gap-3">
                        <img
                            :src="profileStore.me?.avatar || ''"
                            class="w-11 h-11 rounded-full ring-2 ring-brand/20 object-cover bg-gray-100 dark:bg-neutral-800 shrink-0"
                        />
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-gray-900 dark:text-neutral-100 truncate text-sm">
                                Hey, {{ profileStore.me?.username }}! 👋
                            </p>
                            <p class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                                <template v-if="!sellerStore.hasSellers">
                                    Ready to shop or
                                    <NuxtLink to="/sellers/create" class="text-brand hover:underline font-medium">open a store?</NuxtLink>
                                </template>
                                <template v-else>Ready to sell?</template>
                            </p>
                        </div>
                    </div>
                </div>
            </ClientOnly>

            <!-- Top Shops -->
            <div
                v-if="topSellers.length"
                class="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-neutral-800"
            >
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <Icon name="mdi:store" size="18" class="text-brand" />
                        <h3 class="text-sm font-bold text-gray-900 dark:text-neutral-100">Top Shops</h3>
                    </div>
                    <NuxtLink to="/discover" class="text-xs font-semibold text-brand hover:underline flex items-center gap-0.5">
                        See All <Icon name="mdi:chevron-right" size="14" />
                    </NuxtLink>
                </div>
                <div class="space-y-1">
                    <div
                        v-for="seller in topSellers.slice(0, 5)"
                        :key="seller.store_slug"
                        class="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <NuxtLink
                            :to="`/sellers/profile/${seller.store_slug}`"
                            class="flex items-center gap-3 min-w-0 flex-1"
                        >
                            <div class="relative shrink-0">
                                <img
                                    :src="seller.store_logo || ''"
                                    class="w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-neutral-800 ring-2 ring-gray-100 dark:ring-neutral-800"
                                />
                                <div
                                    v-if="seller.is_verified"
                                    class="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-px border-2 border-white dark:border-neutral-900"
                                >
                                    <Icon name="mdi:check" size="8" class="text-white" />
                                </div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-xs font-semibold text-gray-900 dark:text-neutral-100 truncate group-hover:text-brand transition-colors">
                                    {{ seller.store_name }}
                                </p>
                                <p class="text-[10px] text-gray-400 dark:text-neutral-500">
                                    {{ seller._count?.products || 0 }} items · {{ formatNumber(seller.followers_count || 0) }} followers
                                </p>
                            </div>
                        </NuxtLink>
                        <ClientOnly>
                            <button
                                v-if="profileStore.isLoggedIn"
                                @click.stop="toggleFollow(seller)"
                                class="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all shrink-0"
                                :class="followedIds.has(seller.id)
                                    ? 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'
                                    : 'bg-brand text-white hover:bg-brand/90'"
                            >
                                {{ followedIds.has(seller.id) ? 'Following' : 'Follow' }}
                            </button>
                        </ClientOnly>
                    </div>
                </div>
            </div>

            <!-- Browse Categories -->
            <div
                v-if="categories.length"
                class="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-neutral-800"
            >
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="mdi:shape-outline" size="18" class="text-brand" />
                    <h3 class="text-sm font-bold text-gray-900 dark:text-neutral-100">Browse Categories</h3>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <NuxtLink
                        v-for="cat in categories.slice(0, 6)"
                        :key="cat.id"
                        :to="`/category/${cat.slug}`"
                        class="group flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-brand hover:bg-brand/5 dark:hover:bg-brand/10 transition-all"
                    >
                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <img
                                v-if="cat.thumbnailCatUrl"
                                :src="cat.thumbnailCatUrl"
                                :alt="cat.name"
                                class="w-full h-full object-cover"
                            />
                            <Icon v-else name="mdi:shape" size="20" class="text-gray-400" />
                        </div>
                        <span class="text-[11px] font-semibold text-gray-700 dark:text-neutral-300 group-hover:text-brand transition-colors text-center line-clamp-1">
                            {{ cat.name }}
                        </span>
                    </NuxtLink>
                </div>
                <NuxtLink
                    to="/discover"
                    class="mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand hover:bg-brand/5 dark:hover:bg-brand/10 rounded-lg transition-colors"
                >
                    View All Categories <Icon name="mdi:arrow-right" size="14" />
                </NuxtLink>
            </div>

            <!-- Quick Links -->
            <div class="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-neutral-800">
                <div class="flex items-center gap-2 mb-2">
                    <Icon name="mdi:link-variant" size="18" class="text-brand" />
                    <h3 class="text-sm font-bold text-gray-900 dark:text-neutral-100">Quick Links</h3>
                </div>
                <div class="space-y-0.5">
                    <NuxtLink to="/thrift" class="quick-link group">
                        <Icon name="mdi:tshirt-crew-outline" size="16" class="text-gray-400 group-hover:text-brand" />
                        <span>Thrift Store</span>
                    </NuxtLink>
                    <NuxtLink to="/reels" class="quick-link group">
                        <Icon name="mdi:play-box-outline" size="16" class="text-gray-400 group-hover:text-brand" />
                        <span>Reels</span>
                    </NuxtLink>
                    <NuxtLink to="/sellers/create" class="quick-link group">
                        <Icon name="mdi:store-plus-outline" size="16" class="text-gray-400 group-hover:text-brand" />
                        <span>Open a Store</span>
                    </NuxtLink>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-1 py-2 text-xs text-gray-400 dark:text-neutral-600">
                <div class="flex flex-wrap gap-x-2 gap-y-1 mb-2">
                    <NuxtLink to="/about" class="hover:text-gray-600 dark:hover:text-neutral-400 hover:underline">About</NuxtLink>
                    <span>·</span>
                    <NuxtLink to="/help" class="hover:text-gray-600 dark:hover:text-neutral-400 hover:underline">Help</NuxtLink>
                    <span>·</span>
                    <NuxtLink to="/terms" class="hover:text-gray-600 dark:hover:text-neutral-400 hover:underline">Terms</NuxtLink>
                    <span>·</span>
                    <NuxtLink to="/privacy" class="hover:text-gray-600 dark:hover:text-neutral-400 hover:underline">Privacy</NuxtLink>
                </div>
                <div class="flex items-center justify-between">
                    <p>© {{ new Date().getFullYear() }} Styli</p>
                    <LanguageSwitcher />
                </div>
            </div>
        </div>

        <!-- Dasah AI CTA (sticky bottom) -->
        <div class="flex-shrink-0 pt-3">
            <div class="relative overflow-hidden bg-gradient-to-br from-brand to-pink-600 rounded-2xl p-4 text-white shadow-lg">
                <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div class="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                <div class="relative z-10">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Icon name="mdi:robot-happy-outline" size="22" class="text-white" />
                        </div>
                        <div>
                            <h4 class="font-bold text-sm leading-tight">Meet Dasah</h4>
                            <p class="text-[11px] text-white/80">Your Shopping Assistant</p>
                        </div>
                    </div>
                    <p class="text-xs text-white/90 mb-3 leading-relaxed">
                        Get personalised style advice and product picks! 💕
                    </p>
                    <button
                        @click="$emit('open-ai')"
                        class="w-full py-2.5 bg-white text-brand rounded-xl text-xs font-bold hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="mdi:message-text" size="16" />
                        Chat Now
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'

defineEmits(['open-ai'])

const profileStore = useProfileStore()
const sellerStore = useSellerStore()
const { data } = useLayoutData()

const topSellers = computed(() => data.value?.topSellers ?? [])
const categories = computed(() => data.value?.categories ?? [])

// Optimistic follow tracking
const followedIds = ref(new Set<string>())

const toggleFollow = async (seller: any) => {
    const id = seller.id
    const isFollowing = followedIds.value.has(id)
    if (isFollowing) {
        followedIds.value.delete(id)
        seller.followers_count = Math.max(0, (seller.followers_count || 1) - 1)
        await $fetch(`/api/seller/${id}/unfollow`, { method: 'DELETE' }).catch(() => {
            followedIds.value.add(id)
            seller.followers_count++
        })
    } else {
        followedIds.value.add(id)
        seller.followers_count = (seller.followers_count || 0) + 1
        await $fetch(`/api/seller/${id}/follow`, { method: 'POST' }).catch(() => {
            followedIds.value.delete(id)
            seller.followers_count--
        })
    }
}

const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toString()
}
</script>

<style scoped>
.quick-link {
    @apply flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-neutral-400 hover:text-brand dark:hover:text-brand hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #404040; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
:global(.dark) .custom-scrollbar { scrollbar-color: #404040 transparent; }
</style>