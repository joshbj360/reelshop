<template>
  <div
    class="flex h-full flex-col border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
  >
    <!-- ─── TAB NAVIGATION ──────────────────────────────────────────────────── -->
    <div
      class="flex shrink-0 gap-1 border-b border-gray-100 bg-gray-50/50 p-2 dark:border-neutral-800/50 dark:bg-neutral-900/50"
    >
      <button
        @click="activeTab = 'discover'"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        :class="
          activeTab === 'discover'
            ? 'border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
        "
      >
        <Icon name="mdi:compass-outline" size="18" />
        <span>Discover</span>
      </button>
      <button
        @click="activeTab = 'ai'"
        class="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-sm font-semibold transition-all"
        :class="
          activeTab === 'ai'
            ? 'border border-transparent bg-gradient-to-r from-brand to-purple-600 text-white shadow-md shadow-brand/20'
            : 'text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand dark:text-neutral-400 dark:hover:bg-neutral-800'
        "
      >
        <div
          v-if="activeTab === 'ai'"
          class="pointer-events-none absolute inset-0 bg-white/20 blur-sm"
        ></div>
        <Icon
          :name="
            activeTab === 'ai' ? 'mdi:robot-happy' : 'mdi:robot-happy-outline'
          "
          size="18"
          class="relative z-10"
        />
        <span class="relative z-10">Dasah AI</span>
      </button>
    </div>

    <!-- ─── SCROLLABLE CONTENT AREA ─────────────────────────────────────────── -->
    <div class="custom-scrollbar flex-1 overflow-y-auto p-3">
      <!-- ========================================== -->
      <!-- TAB 1: DISCOVER CONTENT                    -->
      <!-- ========================================== -->
      <div v-show="activeTab === 'discover'" class="space-y-5 pb-4">
        <!-- 1. Welcome Card (If logged in) -->
        <ClientOnly>
          <div
            v-if="profileStore.isLoggedIn"
            class="rounded-xl border border-brand/10 bg-gradient-to-br from-brand/5 to-purple-500/5 p-4 shadow-sm dark:from-brand/10 dark:to-purple-500/10"
          >
            <div class="flex items-center gap-3">
              <Avatar
                :username="profileStore.me?.username || 'Shopper'"
                :avatar="profileStore.me?.avatar ?? undefined"
                size="md"
              />
              <div class="min-w-0 flex-1">
                <p
                  class="truncate text-sm font-bold text-gray-900 dark:text-neutral-100"
                >
                  Hey, {{ profileStore.me?.username || 'Shopper' }}! 👋
                </p>
                <p class="mt-0.5 text-xs text-gray-600 dark:text-neutral-400">
                  <template v-if="!sellerStore.hasSellers">
                    Ready to shop or
                    <NuxtLink
                      to="/sellers/create"
                      class="font-medium text-brand hover:underline"
                      >open a store?</NuxtLink
                    >
                  </template>
                  <template v-else> Ready to manage your store? </template>
                </p>
              </div>
            </div>
          </div>
        </ClientOnly>

        <!-- 2. Top Shops Section -->
        <div
          v-if="topSellers.length"
          class="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon
                name="mdi:store-check-outline"
                size="20"
                class="text-brand"
              />
              <h3 class="font-bold text-gray-900 dark:text-neutral-100">
                Top Shops
              </h3>
            </div>
            <NuxtLink
              to="/sellers"
              class="flex items-center gap-0.5 text-xs font-semibold text-brand transition-colors hover:text-[#d81b36] hover:underline"
            >
              <span>See All</span>
              <Icon name="mdi:chevron-right" size="16" />
            </NuxtLink>
          </div>

          <div class="space-y-1.5">
            <div
              v-for="seller in topSellers.slice(0, 5)"
              :key="seller.id"
              class="group -mx-2.5 flex items-center justify-between rounded-lg border border-transparent p-2.5 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <NuxtLink
                :to="`/sellers/profile/${seller.store_slug}`"
                class="flex min-w-0 flex-1 items-center space-x-3"
              >
                <div class="relative flex shrink-0 items-center justify-center">
                  <img
                    :src="
                      seller.store_logo ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${seller.store_name}`
                    "
                    :alt="seller.store_name"
                    class="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-white object-cover transition-all group-hover:border-brand/30 dark:border-neutral-700 dark:bg-neutral-900"
                  />

                  <!-- Bulletproof Verified Badge -->
                  <div
                    v-if="seller.is_verified"
                    class="absolute -bottom-0.5 -right-0.5 z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-blue-500 dark:border-neutral-900"
                  >
                    <Icon
                      name="mdi:check-decagram"
                      size="10"
                      class="text-white"
                    />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p
                    class="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-brand dark:text-neutral-100"
                  >
                    {{ seller.store_name }}
                  </p>
                  <div
                    class="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-neutral-400"
                  >
                    <span>{{ seller._count?.products || 0 }} items</span>
                    <span>•</span>
                    <span
                      >{{
                        formatNumber(getFollowerCount(seller))
                      }}
                      followers</span
                    >
                  </div>
                </div>
              </NuxtLink>

              <!-- Follow button -->
              <ClientOnly>
                <button
                  v-if="profileStore.isLoggedIn"
                  @click.stop.prevent="toggleFollow(seller)"
                  class="ml-2 shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
                  :class="
                    followedIds.has(seller.id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                      : 'bg-brand text-white hover:bg-brand/90 hover:shadow-sm hover:shadow-brand/20'
                  "
                >
                  {{ followedIds.has(seller.id) ? 'Following' : 'Follow' }}
                </button>
              </ClientOnly>
            </div>
          </div>
        </div>

        <!-- 3. Categories Section -->
        <div
          v-if="categories.length"
          class="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30"
        >
          <div class="mb-4 flex items-center gap-2">
            <Icon name="mdi:shape-outline" size="20" class="text-brand" />
            <h3 class="font-bold text-gray-900 dark:text-neutral-100">
              Browse Categories
            </h3>
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <NuxtLink
              v-for="cat in categories.slice(0, 6)"
              :key="cat.id"
              :to="`/category/${cat.slug}`"
              class="group flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-brand/30 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div
                class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-110 dark:bg-neutral-800"
              >
                <img
                  v-if="cat.thumbnailCatUrl"
                  :src="cat.thumbnailCatUrl"
                  :alt="cat.name"
                  class="h-full w-full object-cover"
                />
                <Icon
                  v-else
                  name="mdi:hanger"
                  size="20"
                  class="text-gray-400 dark:text-gray-500"
                />
              </div>
              <span
                class="line-clamp-1 w-full px-1 text-center text-xs font-semibold text-gray-700 transition-colors group-hover:text-brand dark:text-neutral-300"
              >
                {{ cat.name }}
              </span>
            </NuxtLink>
          </div>

          <!-- View All Categories -->
          <NuxtLink
            to="/categories"
            class="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-brand shadow-sm transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <span>View All Categories</span>
            <Icon name="mdi:arrow-right" size="16" />
          </NuxtLink>
        </div>

        <!-- 4. Quick Links -->
        <div
          class="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30"
        >
          <div class="mb-3 flex items-center gap-2">
            <Icon name="mdi:link-variant" size="20" class="text-brand" />
            <h3 class="font-bold text-gray-900 dark:text-neutral-100">
              Quick Links
            </h3>
          </div>
          <div class="space-y-1.5">
            <NuxtLink to="/discover" class="quick-link group">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors group-hover:border-brand/30 group-hover:text-brand dark:border-neutral-700 dark:bg-neutral-900"
              >
                <Icon name="mdi:compass-outline" size="18" />
              </div>
              <span
                class="text-sm font-medium text-gray-700 transition-colors group-hover:text-brand dark:text-neutral-300"
                >Discover</span
              >
            </NuxtLink>
            <NuxtLink to="/thrift" class="quick-link group">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors group-hover:border-brand/30 group-hover:text-brand dark:border-neutral-700 dark:bg-neutral-900"
              >
                <Icon name="mdi:recycle" size="18" />
              </div>
              <span
                class="text-sm font-medium text-gray-700 transition-colors group-hover:text-brand dark:text-neutral-300"
                >Thrift Store</span
              >
            </NuxtLink>
            <NuxtLink to="/trending" class="quick-link group">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors group-hover:border-brand/30 group-hover:text-brand dark:border-neutral-700 dark:bg-neutral-900"
              >
                <Icon name="mdi:fire" size="18" />
              </div>
              <span
                class="text-sm font-medium text-gray-700 transition-colors group-hover:text-brand dark:text-neutral-300"
                >Trending Now</span
              >
            </NuxtLink>
          </div>
        </div>

        <!-- 5. Footer Links -->
        <div class="px-2 py-4">
          <div
            class="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-400 dark:text-neutral-500"
          >
            <NuxtLink
              to="/about"
              class="transition-colors hover:text-gray-800 dark:hover:text-gray-300"
              >About</NuxtLink
            >
            <NuxtLink
              to="/help"
              class="transition-colors hover:text-gray-800 dark:hover:text-gray-300"
              >Help Center</NuxtLink
            >
            <NuxtLink
              to="/terms"
              class="transition-colors hover:text-gray-800 dark:hover:text-gray-300"
              >Terms</NuxtLink
            >
            <NuxtLink
              to="/privacy"
              class="transition-colors hover:text-gray-800 dark:hover:text-gray-300"
              >Privacy</NuxtLink
            >
          </div>
          <div
            class="flex items-center justify-center text-[11px] font-medium text-gray-400 dark:text-neutral-600"
          >
            <p>
              © {{ new Date().getFullYear() }}
              {{ useRuntimeConfig().public.siteName || 'Styli' }}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 2: AI CHAT EMBEDDED                    -->
      <!-- ========================================== -->
      <div v-show="activeTab === 'ai'" class="flex h-full flex-col pb-4">
        <!-- AI Intro Header -->
        <div
          class="relative mb-4 overflow-hidden rounded-xl border border-brand/20 bg-gradient-to-br from-brand/10 via-purple-500/10 to-transparent p-5 dark:from-brand/20 dark:via-purple-500/10"
        >
          <div
            class="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand/10 blur-xl"
          ></div>
          <div class="relative z-10 flex flex-col items-center text-center">
            <div
              class="mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-md dark:border-neutral-900 dark:bg-neutral-900"
            >
              <Icon name="mdi:robot-happy" size="32" class="text-brand" />
            </div>
            <h3
              class="mb-1 text-lg font-extrabold text-gray-900 dark:text-white"
            >
              Hi, I'm Dasah! ✨
            </h3>
            <p
              class="max-w-[250px] text-sm font-medium text-gray-600 dark:text-neutral-400"
            >
              Your personal AI shopping assistant. Ask me to find products,
              style outfits, or check trends.
            </p>
          </div>
        </div>

        <!-- Chat Component Container -->
        <div
          class="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <!-- Replace this slot/component with your actual AIChat component, configured to fit a container rather than a modal -->
          <!-- Example: <AIChatEmbedded /> -->

          <!-- Placeholder for visually demonstrating the chat area -->
          <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div class="flex gap-3">
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white"
              >
                <Icon name="mdi:robot" size="16" />
              </div>
              <div
                class="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 p-3 text-sm text-gray-800 dark:bg-neutral-800 dark:text-neutral-200"
              >
                I can help you find the perfect outfit for any occasion! What
                are you looking for today?
              </div>
            </div>

            <!-- Example suggestion chips -->
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                class="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/5 dark:bg-neutral-900"
              >
                "Summer wedding outfits"
              </button>
              <button
                class="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/5 dark:bg-neutral-900"
              >
                "Affordable vintage jackets"
              </button>
            </div>
          </div>

          <!-- Chat Input Area -->
          <div
            class="border-t border-gray-100 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
          >
            <div class="relative">
              <input
                type="text"
                placeholder="Message Dasah..."
                class="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm transition-all focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-neutral-700 dark:bg-neutral-950"
              />
              <button
                class="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-[#d81b36]"
              >
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
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'
import { useLayoutData } from '~/composables/useLayoutData'
import { useSocialApi } from '~~/layers/profile/app/services/social.api'

import Avatar from '~~/layers/profile/app/components/Avatar.vue'

const profileStore = useProfileStore()
const sellerStore = useSellerStore()
const { data } = useLayoutData()

// State for Tabs
const activeTab = ref<'discover' | 'ai'>('discover')

const topSellers = computed(() => data.value?.topSellers ?? [])
const categories = computed(() => data.value?.categories ?? [])

const socialApi = useSocialApi()

// Optimistic follow tracking — keyed by seller DB ID
const followedIds = ref(new Set<string>())
// Local counts override — keyed by seller DB ID
const followerCountOverrides = ref(new Map<string, number>())

// Load the current user's followed seller IDs on mount
onMounted(async () => {
  if (!profileStore.isLoggedIn) return
  try {
    const res = await socialApi.getFollowedSellerIds()
    followedIds.value = new Set(res.data ?? [])
  } catch {
    // silent — UI defaults to not-following state
  }
})

const getFollowerCount = (seller: any) => {
  return followerCountOverrides.value.has(seller.id)
    ? followerCountOverrides.value.get(seller.id)!
    : seller.followers_count || 0
}

const toggleFollow = async (seller: any) => {
  const dbId = seller.id
  const slug = seller.store_slug
  const isFollowing = followedIds.value.has(dbId)
  const currentCount = getFollowerCount(seller)

  // Optimistic UI
  if (isFollowing) {
    followedIds.value.delete(dbId)
    followerCountOverrides.value.set(dbId, Math.max(0, currentCount - 1))
    try {
      await socialApi.unfollowSeller(slug)
    } catch {
      followedIds.value.add(dbId)
      followerCountOverrides.value.set(dbId, currentCount)
    }
  } else {
    followedIds.value.add(dbId)
    followerCountOverrides.value.set(dbId, currentCount + 1)
    try {
      await socialApi.followSeller(slug)
    } catch {
      followedIds.value.delete(dbId)
      followerCountOverrides.value.set(dbId, currentCount)
    }
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
  @apply -mx-2 flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm dark:hover:border-neutral-700 dark:hover:bg-neutral-800;
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
