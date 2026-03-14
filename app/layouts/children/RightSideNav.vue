<template>
    <div class="flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800">
        <!-- ─── TAB NAVIGATION ──────────────────────────────────────────────────── -->
        <div class="flex p-2 gap-1 border-b border-gray-100 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-900/50 shrink-0">
            <button 
                @click="activeTab = 'discover'"
                class="flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                :class="activeTab === 'discover' 
                    ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-neutral-700' 
                    : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-700 dark:hover:text-neutral-300'"
            >
                <Icon name="mdi:compass-outline" size="18" />
                <span>Discover</span>
            </button>
            <button 
                @click="activeTab = 'ai'"
                class="flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                :class="activeTab === 'ai' 
                    ? 'bg-gradient-to-r from-brand to-purple-600 text-white shadow-md shadow-brand/20 border border-transparent' 
                    : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-brand transition-colors'"
            >
                <div v-if="activeTab === 'ai'" class="absolute inset-0 bg-white/20 blur-sm pointer-events-none"></div>
                <Icon :name="activeTab === 'ai' ? 'mdi:robot-happy' : 'mdi:robot-happy-outline'" size="18" class="relative z-10" />
                <span class="relative z-10">Dasah AI</span>
            </button>
        </div>

        <!-- ─── SCROLLABLE CONTENT AREA ─────────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-3">
            
            <!-- ========================================== -->
            <!-- TAB 1: DISCOVER CONTENT                    -->
            <!-- ========================================== -->
            <div v-show="activeTab === 'discover'" class="space-y-5 pb-4">
                
                <!-- 1. Welcome Card (If logged in) -->
                <ClientOnly>
                    <div 
                        v-if="profileStore.isLoggedIn" 
                        class="bg-gradient-to-br from-brand/5 to-purple-500/5 dark:from-brand/10 dark:to-purple-500/10 rounded-xl p-4 border border-brand/10 shadow-sm"
                    >
                        <div class="flex items-center gap-3">
                            <Avatar :username="profileStore.me?.username || 'Shopper'" :avatar="profileStore.me?.avatar ?? undefined" size="md"  />
                            <div class="flex-1 min-w-0">
                                <p class="font-bold text-gray-900 dark:text-neutral-100 truncate text-sm">
                                    Hey, {{ profileStore.me?.username || 'Shopper' }}! 👋
                                </p>
                                <p class="text-xs text-gray-600 dark:text-neutral-400 mt-0.5">
                                    <template v-if="!sellerStore.hasSellers">
                                        Ready to shop or 
                                        <NuxtLink to="/sellers/create" class="text-brand font-medium hover:underline">open a store?</NuxtLink>
                                    </template>
                                    <template v-else>
                                        Ready to manage your store?
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                </ClientOnly>

                <!-- 2. Top Shops Section -->
                <div v-if="topSellers.length" class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:store-check-outline" size="20" class="text-brand" />
                            <h3 class="font-bold text-gray-900 dark:text-neutral-100">Top Shops</h3>
                        </div>
                        <NuxtLink 
                            to="/sellers" 
                            class="text-xs font-semibold text-brand hover:text-[#d81b36] hover:underline flex items-center gap-0.5 transition-colors"
                        >
                            <span>See All</span>
                            <Icon name="mdi:chevron-right" size="16" />
                        </NuxtLink>
                    </div>
                    
                    <div class="space-y-1.5">
                        <div 
                            v-for="seller in topSellers.slice(0, 5)" 
                            :key="seller.id"
                            class="group flex items-center justify-between p-2.5 -mx-2.5 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-all hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-neutral-700"
                        >
                            <NuxtLink
                                :to="`/sellers/profile/${seller.store_slug}`"
                                class="flex items-center space-x-3 min-w-0 flex-1"
                            >
                                <div class="relative shrink-0 flex items-center justify-center">
                                <img :src="seller.store_logo || `https://api.dicebear.com/7.x/initials/svg?seed=${seller.store_name}`"
                                    :alt="seller.store_name"
                                    class="w-10 h-10 rounded-full object-cover bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 group-hover:border-brand/30 transition-all shrink-0" />
                                
                                <!-- Bulletproof Verified Badge -->
                                <div v-if="seller.is_verified"
                                    class="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 z-10 shrink-0">
                                    <Icon name="mdi:check-decagram" size="10" class="text-white" />
                                </div>
                            </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-bold text-gray-900 dark:text-neutral-100 truncate group-hover:text-brand transition-colors">
                                        {{ seller.store_name }}
                                    </p>
                                    <div class="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-neutral-400 mt-0.5">
                                        <span>{{ seller._count?.products || 0 }} items</span>
                                        <span>•</span>
                                        <span>{{ formatNumber(getFollowerCount(seller)) }} followers</span>
                                    </div>
                                </div>
                            </NuxtLink>
                            
                            <!-- Follow button -->
                            <ClientOnly>
                                <button 
                                    v-if="profileStore.isLoggedIn"
                                    @click.stop.prevent="toggleFollow(seller)"
                                    class="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all shrink-0 ml-2"
                                    :class="followedIds.has(seller.id) 
                                        ? 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600' 
                                        : 'bg-brand text-white hover:bg-brand/90 hover:shadow-sm hover:shadow-brand/20'"
                                >
                                    {{ followedIds.has(seller.id) ? 'Following' : 'Follow' }}
                                </button>
                            </ClientOnly>
                        </div>
                    </div>
                </div>

                <!-- 3. Categories Section -->
                <div v-if="categories.length" class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                    <div class="flex items-center gap-2 mb-4">
                        <Icon name="mdi:shape-outline" size="20" class="text-brand" />
                        <h3 class="font-bold text-gray-900 dark:text-neutral-100">Browse Categories</h3>
                    </div>
                    <div class="grid grid-cols-2 gap-2.5">
                        <NuxtLink
                            v-for="cat in categories.slice(0, 6)" 
                            :key="cat.id" 
                            :to="`/category/${cat.slug}`"
                            class="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 hover:border-brand/30 hover:shadow-sm transition-all cursor-pointer"
                        >
                            <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-50 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img 
                                    v-if="cat.thumbnailCatUrl"
                                    :src="cat.thumbnailCatUrl" 
                                    :alt="cat.name"
                                    class="w-full h-full object-cover"
                                />
                                <Icon v-else name="mdi:hanger" size="20" class="text-gray-400 dark:text-gray-500" />
                            </div>
                            <span class="text-xs font-semibold text-gray-700 dark:text-neutral-300 group-hover:text-brand transition-colors text-center line-clamp-1 w-full px-1">
                                {{ cat.name }}
                            </span>
                        </NuxtLink>
                    </div>
                    
                    <!-- View All Categories -->
                    <NuxtLink 
                        to="/categories"
                        class="mt-4 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-brand bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors shadow-sm"
                    >
                        <span>View All Categories</span>
                        <Icon name="mdi:arrow-right" size="16" />
                    </NuxtLink>
                </div>

                <!-- 4. Quick Links -->
                <div class="bg-gray-50/50 dark:bg-neutral-800/30 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                    <div class="flex items-center gap-2 mb-3">
                        <Icon name="mdi:link-variant" size="20" class="text-brand" />
                        <h3 class="font-bold text-gray-900 dark:text-neutral-100">Quick Links</h3>
                    </div>
                    <div class="space-y-1.5">
                        <NuxtLink to="/discover" class="quick-link group">
                            <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                                <Icon name="mdi:compass-outline" size="18" />
                            </div>
                            <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Discover</span>
                        </NuxtLink>
                        <NuxtLink to="/thrift" class="quick-link group">
                            <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                                <Icon name="mdi:recycle" size="18" />
                            </div>
                            <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Thrift Store</span>
                        </NuxtLink>
                        <NuxtLink to="/trending" class="quick-link group">
                            <div class="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 flex items-center justify-center group-hover:border-brand/30 group-hover:text-brand transition-colors">
                                <Icon name="mdi:fire" size="18" />
                            </div>
                            <span class="text-sm text-gray-700 dark:text-neutral-300 group-hover:text-brand font-medium transition-colors">Trending Now</span>
                        </NuxtLink>
                    </div>
                </div>

                <!-- 5. Footer Links -->
                <div class="px-2 py-4">
                    <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-400 dark:text-neutral-500 mb-3 justify-center">
                        <NuxtLink to="/about" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">About</NuxtLink>
                        <NuxtLink to="/help" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Help Center</NuxtLink>
                        <NuxtLink to="/terms" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Terms</NuxtLink>
                        <NuxtLink to="/privacy" class="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Privacy</NuxtLink>
                    </div>
                    <div class="flex items-center justify-center text-[11px] font-medium text-gray-400 dark:text-neutral-600">
                        <p>© {{ new Date().getFullYear() }} {{ useRuntimeConfig().public.siteName || 'Styli' }}. All rights reserved.</p>
                    </div>
                </div>

            </div>

            <!-- ========================================== -->
            <!-- TAB 2: AI CHAT EMBEDDED                    -->
            <!-- ========================================== -->
            <div v-show="activeTab === 'ai'" class="h-full flex flex-col pb-4">
                
                <!-- AI Intro Header -->
                <div class="bg-gradient-to-br from-brand/10 via-purple-500/10 to-transparent dark:from-brand/20 dark:via-purple-500/10 rounded-xl p-5 border border-brand/20 mb-4 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-brand/10 rounded-full blur-xl pointer-events-none"></div>
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div class="w-16 h-16 rounded-full bg-white dark:bg-neutral-900 border-4 border-white dark:border-neutral-900 shadow-md flex items-center justify-center mb-3">
                            <Icon name="mdi:robot-happy" size="32" class="text-brand" />
                        </div>
                        <h3 class="font-extrabold text-lg text-gray-900 dark:text-white mb-1">Hi, I'm Dasah! ✨</h3>
                        <p class="text-sm font-medium text-gray-600 dark:text-neutral-400 max-w-[250px]">
                            Your personal AI shopping assistant. Ask me to find products, style outfits, or check trends.
                        </p>
                    </div>
                </div>

                <!-- Chat Component Container -->
                <div class="flex-1 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
                    <!-- Replace this slot/component with your actual AIChat component, configured to fit a container rather than a modal -->
                    <!-- Example: <AIChatEmbedded /> -->
                    
                    <!-- Placeholder for visually demonstrating the chat area -->
                    <div class="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                        <div class="flex gap-3">
                            <div class="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
                                <Icon name="mdi:robot" size="16" />
                            </div>
                            <div class="bg-gray-100 dark:bg-neutral-800 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 dark:text-neutral-200 max-w-[85%]">
                                I can help you find the perfect outfit for any occasion! What are you looking for today?
                            </div>
                        </div>
                        
                        <!-- Example suggestion chips -->
                        <div class="flex flex-wrap gap-2 mt-2">
                            <button class="text-xs font-medium px-3 py-1.5 bg-white dark:bg-neutral-900 border border-brand/30 text-brand rounded-full hover:bg-brand/5 transition-colors">
                                "Summer wedding outfits"
                            </button>
                            <button class="text-xs font-medium px-3 py-1.5 bg-white dark:bg-neutral-900 border border-brand/30 text-brand rounded-full hover:bg-brand/5 transition-colors">
                                "Affordable vintage jackets"
                            </button>
                        </div>
                    </div>
                    
                    <!-- Chat Input Area -->
                    <div class="p-3 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50">
                        <div class="relative">
                            <input 
                                type="text" 
                                placeholder="Message Dasah..." 
                                class="w-full bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
                            >
                            <button class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-brand text-white rounded-full flex items-center justify-center hover:bg-[#d81b36] transition-colors">
                                <Icon name="mdi:arrow-up" size="16" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useSellerStore } from '~~/layers/seller/app/store/seller.store';
import { useLayoutData } from '~/composables/useLayoutData';
import { useSocialApi } from '~~/layers/profile/app/services/social.api';

import Avatar from '~~/layers/profile/app/components/Avatar.vue';

const profileStore = useProfileStore();
const sellerStore = useSellerStore();
const { data } = useLayoutData();

// State for Tabs
const activeTab = ref<'discover' | 'ai'>('discover');

const topSellers = computed(() => data.value?.topSellers ?? []);
const categories = computed(() => data.value?.categories ?? []);

const socialApi = useSocialApi();

// Optimistic follow tracking — keyed by seller DB ID
const followedIds = ref(new Set<string>());
// Local counts override — keyed by seller DB ID
const followerCountOverrides = ref(new Map<string, number>());

// Load the current user's followed seller IDs on mount
onMounted(async () => {
    if (!profileStore.isLoggedIn) return;
    try {
        const res = await socialApi.getFollowedSellerIds();
        followedIds.value = new Set(res.data ?? []);
    } catch {
        // silent — UI defaults to not-following state
    }
});

const getFollowerCount = (seller: any) => {
    return followerCountOverrides.value.has(seller.id)
        ? followerCountOverrides.value.get(seller.id)!
        : (seller.followers_count || 0);
};

const toggleFollow = async (seller: any) => {
    const dbId = seller.id;
    const slug = seller.store_slug;
    const isFollowing = followedIds.value.has(dbId);
    const currentCount = getFollowerCount(seller);

    // Optimistic UI
    if (isFollowing) {
        followedIds.value.delete(dbId);
        followerCountOverrides.value.set(dbId, Math.max(0, currentCount - 1));
        try {
            await socialApi.unfollowSeller(slug);
        } catch {
            followedIds.value.add(dbId);
            followerCountOverrides.value.set(dbId, currentCount);
        }
    } else {
        followedIds.value.add(dbId);
        followerCountOverrides.value.set(dbId, currentCount + 1);
        try {
            await socialApi.followSeller(slug);
        } catch {
            followedIds.value.delete(dbId);
            followerCountOverrides.value.set(dbId, currentCount);
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