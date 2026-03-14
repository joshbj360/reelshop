<template>
    <div class="flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800">
        <!-- ─── TAB NAVIGATION ──────────────────────────────────────────────────── -->
        <div
            class="flex p-2 gap-1 border-b border-gray-100 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-900/50 shrink-0">
            <!-- 1. Welcome Card (If logged in) -->
            <ClientOnly>
                <div v-if="profileStore.isLoggedIn"
                    class="bg-gradient-to-br from-brand/5 to-purple-500/5 dark:from-brand/10 dark:to-purple-500/10 rounded-xl p-4 border border-brand/10 shadow-sm w-full">
                    <div class="flex items-center gap-3">
                        <div class="relative shrink-0 flex">
                            <Avatar :username="profileStore.me?.username || 'Shopper'"
                                :avatar="profileStore.me?.avatar ?? undefined" size="md" />
                            <!-- Optional Verified Badge for Current User -->
                            <div v-if="profileStore.me?.email_verified" class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 z-10 shrink-0">
                                <Icon name="mdi:check-decagram" size="12" class="text-white" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-bold text-gray-900 dark:text-neutral-100 truncate text-sm">
                                Hey, {{ profileStore.me?.username || 'Shopper' }}! 👋
                            </p>
                            <p class="text-xs text-gray-600 dark:text-neutral-400 mt-0.5">
                                <template v-if="!sellerStore.hasSellers">
                                    Ready to shop or
                                    <NuxtLink to="/seller/create" class="text-brand font-medium hover:underline">open a
                                        store?</NuxtLink>
                                </template>
                                <template v-else>
                                    Ready to manage your store?
                                </template>
                            </p>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </div>

        <!-- ─── SCROLLABLE CONTENT AREA ─────────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-3">

            <!-- 2. Top Shops Section -->
            <div v-if="topSellers.length"
                class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800 mb-4">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-2">
                        <Icon name="mdi:store-check-outline" size="20" class="text-brand" />
                        <h3 class="font-bold text-gray-900 dark:text-neutral-100">Top Shops</h3>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <div v-for="seller in topSellers.slice(0, 5)" :key="seller.id"
                        class="group flex items-center justify-between p-2.5 -mx-2.5 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-all hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-neutral-700">
                        <NuxtLink :to="`/sellers/profile/${seller.store_slug}`"
                            class="flex items-center space-x-3 min-w-0 flex-1">
                            
                            <!-- Avatar Wrapper with Fixed Dimensions -->
                            <div class="relative shrink-0 flex items-center justify-center">
                                <img :src="seller.store_logo || `https://api.dicebear.com/7.x/initials/svg?seed=${seller.store_name}`"
                                    :alt="seller.store_name"
                                    class="w-10 h-10 rounded-full object-cover bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 group-hover:border-brand/30 transition-all shrink-0" />
                                
                                <!-- Bulletproof Verified Badge -->
                                <div v-if="seller.is_verified"
                                    class="absolute -bottom-0.5 -right-0.5 w-[18px] h-[10px] bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 z-10 shrink-0">
                                    <Icon name="mdi:check-decagram" size="10" class="text-white" />
                                </div>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-sm font-bold text-gray-900 dark:text-neutral-100 truncate group-hover:text-brand transition-colors">
                                    {{ seller.store_name }}
                                </p>
                                <div
                                    class="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-neutral-400 mt-0.5">
                                    <span>{{ seller._count?.products || 0 }} items</span>
                                    <span>•</span>
                                    <span>{{ formatNumber(seller.followers_count || 0) }} followers</span>
                                </div>
                            </div>
                        </NuxtLink>

                        <!-- Follow button -->
                        <ClientOnly>
                            <button v-if="profileStore.isLoggedIn" @click.stop.prevent="toggleFollow(seller)"
                                class="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all shrink-0 ml-2"
                                :class="followedIds.has(seller.id)
                                    ? 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
                                    : 'bg-brand text-white hover:bg-brand/90 hover:shadow-sm hover:shadow-brand/20'">
                                {{ followedIds.has(seller.id) ? 'Following' : 'Follow' }}
                            </button>
                        </ClientOnly>
                    </div>
                </div>
            </div>

            <!-- 4. Quick Links -->
            <div
                class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800 mb-4">
                <div class="flex items-center gap-2 mb-3">
                    <Icon name="mdi:link-variant" size="20" class="text-brand" />
                    <h3 class="font-bold text-gray-900 dark:text-neutral-100">Quick Links</h3>
                </div>
                <div class="space-y-1.5">
                    <NuxtLink to="/discover" class="quick-link group">
                        <div
                            class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors shrink-0">
                            <Icon name="mdi:compass-outline" size="18" />
                        </div>
                        <span
                            class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Discover</span>
                    </NuxtLink>
                    <NuxtLink to="/thrift" class="quick-link group">
                        <div
                            class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors shrink-0">
                            <Icon name="mdi:recycle" size="18" />
                        </div>
                        <span
                            class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Thrift
                            Store</span>
                    </NuxtLink>
                    <NuxtLink to="/trending" class="quick-link group">
                        <div
                            class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors shrink-0">
                            <Icon name="mdi:fire" size="18" />
                        </div>
                        <span
                            class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Trending
                            Now</span>
                    </NuxtLink>
                </div>
            </div>

            <!-- 5. Footer Links -->
            <div class="px-2 py-4">
                <div
                    class="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-400 dark:text-neutral-500 mb-3 justify-center">
                    <NuxtLink to="/about" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">About
                    </NuxtLink>
                    <NuxtLink to="/help" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Help
                        Center
                    </NuxtLink>
                    <NuxtLink to="/terms" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Terms
                    </NuxtLink>
                    <NuxtLink to="/privacy" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                        Privacy
                    </NuxtLink>
                </div>
                <div
                    class="flex items-center justify-center text-[11px] font-medium text-gray-400 dark:text-neutral-600 text-center">
                    <p>© {{ new Date().getFullYear() }} {{ useRuntimeConfig().public.siteName || 'Styli' }}. All rights
                        reserved.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useSellerStore } from '~~/layers/seller/app/store/seller.store';
import { useLayoutData } from '~/composables/useLayoutData';
import { useSocialApi } from '~~/layers/profile/app/services/social.api';

import Avatar from '~~/layers/profile/app/components/Avatar.vue';

const profileStore = useProfileStore();
const sellerStore = useSellerStore();
const { data } = useLayoutData();
const socialApi = useSocialApi();

// State for Tabs
const activeTab = ref<'discover' | 'ai'>('discover');

const topSellers = computed(() => data.value?.topSellers ?? []);
const categories = computed(() => data.value?.categories ?? []);

// Optimistic follow tracking
const followedIds = ref(new Set<string>());

const toggleFollow = async (seller: any) => {
    const id = seller.id;
    const isFollowing = followedIds.value.has(id);

    // Optimistic UI Update
    if (isFollowing) {
        followedIds.value.delete(id);
        seller.followers_count = Math.max(0, (seller.followers_count || 1) - 1);

        try {
            await socialApi.unfollowSeller(id);
        } catch {
            followedIds.value.add(id);
            seller.followers_count++;
        }
    } else {
        followedIds.value.add(id);
        seller.followers_count = (seller.followers_count || 0) + 1;

        try {
            await socialApi.followSeller(id);
        } catch {
            followedIds.value.delete(id);
            seller.followers_count--;
        }
    }
};

const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
};
</script>

<style scoped>
.quick-link {
    @apply flex items-center gap-3 p-2 -mx-2 rounded-lg transition-all cursor-pointer hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-neutral-700;
}

/* Custom Scrollbar Styling */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
}

/* Dark mode scrollbar */
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #404040;
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #525252;
}

/* Firefox scrollbar */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e5e7eb transparent;
}

:global(.dark) .custom-scrollbar {
    scrollbar-color: #404040 transparent;
}
</style>