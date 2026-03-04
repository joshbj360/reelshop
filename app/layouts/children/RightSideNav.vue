<template>
    <div class="space-y-6">

        <!-- Become a Seller Promo -->
        <ClientOnly>
            <div
                v-if="profileStore.isLoggedIn && !sellerStore.hasSellers"
                class="rounded-2xl overflow-hidden border border-[#f02c56]/20 dark:border-purple-500/20 bg-gradient-to-br from-[#f02c56]/8 to-purple-600/8 dark:from-[#f02c56]/12 dark:to-purple-600/12 p-4"
            >
                <div class="flex items-center gap-2.5 mb-2.5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#f02c56] to-purple-600 flex items-center justify-center shrink-0">
                        <Icon name="mdi:store-plus-outline" size="18" class="text-white" />
                    </div>
                    <div>
                        <p class="text-[13px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">Start selling on Fitsy</p>
                        <p class="text-[11px] text-gray-400 dark:text-neutral-500">Open your store today</p>
                    </div>
                </div>
                <p class="text-[12px] text-gray-500 dark:text-neutral-400 leading-relaxed mb-3">
                    Turn your fashion passion into profit. List products, grow your audience and earn.
                </p>
                <NuxtLink
                    to="/sellers/create"
                    class="flex items-center justify-center gap-1.5 w-full py-2.5 text-[12px] font-bold text-white bg-gradient-to-r from-[#f02c56] to-purple-600 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <Icon name="mdi:arrow-right" size="14" />
                    Become a Seller
                </NuxtLink>
            </div>
        </ClientOnly>

        <!-- Suggestions For You -->
        <div v-if="true">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-neutral-400">{{ $t('feed.suggestedForYou') }}</h3>
                <NuxtLink to="/discover/people" class="text-xs font-semibold text-brand hover:text-[#d81b36]">
                    {{ $t('common.seeAll') }}
                </NuxtLink>
            </div>
            <div class="space-y-3">
                <div v-for="i in 5" :key="i" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">User {{ i }}</p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">Suggested</p>
                    </div>
                    <button class="text-xs font-semibold text-brand hover:text-[#d81b36]">
                        {{ $t('post.follow') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Top Sellers -->
        <div v-if="topSellers && topSellers.length > 0">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-3">{{ $t('feed.topSellers') }}</h3>
            <div class="space-y-3">
                <NuxtLink 
                    v-for="seller in topSellers.slice(0, 5)" 
                    :key="seller.id"
                    :to="`/sellers/profile/${seller.store_slug}`"
                    class="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg p-2 -mx-2 transition-colors"
                >
                    <img 
                        :src="seller.store_logo || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                            {{ seller.store_name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-neutral-400">
                            {{ $t('feed.products', { n: seller.products_count || 0 }) }}
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <!-- Categories -->
        <div v-if="categories && categories.length > 0">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-3">{{ $t('feed.categories') }}</h3>
            <div class="flex flex-wrap gap-2">
                <NuxtLink 
                    v-for="category in categories.slice(0, 8)" 
                    :key="category.id"
                    :to="`/category/${category.slug}`"
                    class="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                    {{ category.name }}
                </NuxtLink>
            </div>
        </div>

        <!-- Footer Links -->
        <div class="text-xs text-gray-500 dark:text-neutral-400 space-y-2 pt-4 border-t border-gray-200 dark:border-neutral-800">
            <div class="flex flex-wrap gap-2">
                <NuxtLink to="/about" class="hover:underline">About</NuxtLink>
                <span>•</span>
                <NuxtLink to="/help" class="hover:underline">Help</NuxtLink>
                <span>•</span>
                <NuxtLink to="/terms" class="hover:underline">Terms</NuxtLink>
                <span>•</span>
                <NuxtLink to="/privacy" class="hover:underline">Privacy</NuxtLink>
            </div>
            <div class="flex items-center justify-between">
                <p class="text-gray-400 dark:text-neutral-500">© 2024 Fitsy</p>
                <LanguageSwitcher />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useSellerStore } from '~~/layers/seller/app/store/seller.store';
defineProps<{
    topSellers?: any[];
    categories?: any[];
}>();

const profileStore = useProfileStore()
const sellerStore = useSellerStore()

</script>