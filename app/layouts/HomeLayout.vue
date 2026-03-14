<template>
  <!-- ─── MOBILE HEADER ─────────────────────────────────────────────────────── -->
  <HeaderNavMobile
    class="transition-transform duration-300 ease-in-out"
    :class="mobileNavVisible ? 'translate-y-0' : '-translate-y-full'"
    @open-search="showSearchOverlay = true"
    @open-notifications="showNotificationOverlay = true"
    @open-cart="showCart = true"
  />

  <!-- ─── MOBILE CATEGORY BAR (Optional) ──────────────────────────────────── -->
  <CategoryListMobile
    v-if="showCategoryBar"
    class="transition-transform duration-300 ease-in-out"
    :class="
      mobileNavVisible
        ? 'translate-y-0'
        : '-translate-y-[calc(100%+3.5rem+env(safe-area-inset-top,0px))]'
    "
  />

  <div
    class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100"
  >
    <!-- ─── LEFT SIDEBAR (Desktop) ────────────────────────────────────────── -->
    <aside
      class="scrollbar-hide fixed left-0 top-0 z-20 hidden h-full w-20 border-r border-gray-200 bg-white md:block xl:w-72 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <SideNav
        @create="showCreateModal = true"
        @open-search="showSearchOverlay = true"
        @open-notifications="showNotificationOverlay = true"
        @open-cart="showCart = true"
      />
    </aside>

    <!-- ─── MAIN CONTENT AREA ─────────────────────────────────────────────── -->
    <main class="md:ml-20 xl:ml-72">
      <div class="mx-auto flex max-w-[1500px]">
        <!-- MAIN FEED/PAGE CONTENT -->
        <div
          ref="mainScrollRef"
          class="main-scroll scrollbar-hide h-[100dvh] min-w-0 flex-1 overflow-y-auto px-2 py-6 transition-all sm:px-4"
          :class="[mainContentClasses, showCategoryBar ? 'has-category' : '']"
          @scroll.passive="onMainScroll"
        >
          <div
            class="w-full pb-20 md:pb-0"
            :class="isNarrowFeed ? 'mx-auto max-w-[560px]' : ''"
          >
            <slot />
          </div>
        </div>

        <!-- RIGHT SIDEBAR (Desktop) -->
        <aside
          v-if="showRightSidebar"
          class="scrollbar-hide hidden h-[100dvh] w-[420px] shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4 lg:block dark:border-neutral-800 dark:bg-neutral-900"
        >
          <slot name="right-sidebar">
            <RightSideNav @open-ai="showAI = true" />
          </slot>
        </aside>
      </div>
    </main>

    <!-- ─── BOTTOM NAVIGATION (Mobile) ────────────────────────────────────── -->
    <BottomNavMobile
      class="transition-transform duration-300 ease-in-out"
      :class="bottomNavVisible ? 'translate-y-0' : 'translate-y-full'"
      @create="showCreateModal = true"
    />

    <!-- ─── FLOATING ACTION BUTTONS & BANNERS ─────────────────────────────── -->
    <MobileAIChatButton
      :is-open="showAI"
      @open="showAI = true"
      @close="showAI = false"
    />

    <ClientOnly>
      <Transition name="seller-banner">
        <div
          v-if="
            !dismissSellerBanner &&
            profileStore.isLoggedIn &&
            !sellerStore.hasSellers
          "
          class="fixed bottom-16 left-0 right-0 z-20 px-3 pb-2 md:hidden"
        >
          <div
            class="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#f02c56] to-purple-600 px-3 py-2.5 shadow-xl"
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20"
            >
              <Icon
                name="mdi:store-plus-outline"
                size="16"
                class="text-white"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[12px] font-bold leading-tight text-white">
                Start selling on Styli
              </p>
              <p class="text-[10px] text-white/70">
                Turn your passion into profit
              </p>
            </div>
            <NuxtLink
              to="/seller/create"
              class="shrink-0 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-brand shadow-sm transition-colors hover:bg-gray-50"
            >
              Start →
            </NuxtLink>
            <button
              @click="dismissSellerBanner = true"
              class="shrink-0 p-1 text-white/60 hover:text-white"
            >
              <Icon name="mdi:close" size="16" />
            </button>
          </div>
        </div>
      </Transition>
    </ClientOnly>

    <!-- ─── MODALS & OVERLAYS ─────────────────────────────────────────────── -->
    <CreateModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @open-post-modal="openPostUploader"
      @open-story-modal="openStoryUploader"
      @open-product-modal="openQuickProductUploader"
    />

    <PostUploadModal
      :is-open="showPostModal"
      @close="showPostModal = false"
      @posted="handlePost"
    />
    <StoryUploadModal
      :is-open="showStoryModal"
      @close="showStoryModal = false"
      @posted="handlePost"
    />
    <QuickProductModal
      :is-open="showQuickProductModal"
      @close="showQuickProductModal = false"
      @posted="handlePost"
    />

    <SearchOverlay
      :is-open="showSearchOverlay"
      @close="showSearchOverlay = false"
    />
    <NotificationOverlay
      :is-open="showNotificationOverlay"
      @close="showNotificationOverlay = false"
    />
    <CartSidebar :is-open="showCart" @close="showCart = false" />

    <ShareModal
      :is-open="shareState.isOpen"
      :url="shareState.url"
      :title="shareState.title"
      @close="closeShare"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// Component Imports
import BottomNavMobile from '~/layouts/children/BottomNavMobile.vue'
import CategoryListMobile from '~/layouts/children/TopMobileCategory.vue'
import SideNav from '~/layouts/children/SideNav.vue'
import HeaderNavMobile from '~/layouts/children/HeaderNavMobile.vue'
import RightSideNav from '~/layouts/children/RightSideNav.vue'

// Modals & Overlays
import CreateModal from '~/components/modals/CreateModal.vue'
import PostUploadModal from '~~/layers/post/app/components/modals/PostUploadModal.vue'
import SearchOverlay from '~/components/search/SearchOverLay.vue'
import NotificationOverlay from '~/components/notifications/NotificationOverlay.vue'
import CartSidebar from '~/components/shop/CartSidebar.vue'
import ShareModal from '~/components/modals/ShareModal.vue'
import StoryUploadModal from '../components/modals/StoryUploadModal.vue'
import MobileAIChatButton from '../../layers/AI/chat/MobileAIChat.vue'

// Composables & Stores
import { useLayoutData } from '~/composables/useLayoutData'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useSellerStore } from '~~/layers/seller/app/store/seller.store'
import { useShareModal } from '~/composables/useShareModal' // Ensure this exists

const route = useRoute()
const { shareState, closeShare } = useShareModal()
const profileStore = useProfileStore()
const sellerStore = useSellerStore()
const { refresh } = useLayoutData()

// ─── PROPS & LAYOUT STATE ─────────────────────────────────────────────────────
const props = defineProps<{
  narrowFeed?: boolean // True for centered narrow feed (homepage, reels)
  hideRightSidebar?: boolean // Force hide right sidebar
  hideCategoryBar?: boolean // Force hide mobile category bar
  customPadding?: boolean // Use custom padding instead of defaults
}>()

// Auto-detect layout based on route if prop is not explicitly passed
const isNarrowFeed = computed(() => {
  if (props.narrowFeed !== undefined) return props.narrowFeed
  return ['index', 'reels', 'profile-username', 'post-id'].includes(
    route.name as string,
  )
})

const showCategoryBar = computed(() => {
  if (props.hideCategoryBar) return false
  return (
    isNarrowFeed.value &&
    ['index', 'discover', 'thrift'].includes(route.name as string)
  )
})

const showRightSidebar = computed(() => {
  if (props.hideRightSidebar) return false
  return true
})

// Dynamic padding based on what headers are visible
const mainContentClasses = computed(() => {
  if (props.customPadding) return ''
  const classes = ['lg:px-4']
  if (showCategoryBar.value) {
    classes.push('pt-28 md:pt-6') // Space for header + category bar
  } else {
    classes.push('pt-16 md:pt-6') // Space for header only
  }
  return classes.join(' ')
})

// ─── MOBILE SCROLL BEHAVIOR (Hide/Show Nav) ──────────────────────────────────
const mainScrollRef = ref<HTMLElement | null>(null)
const mobileNavVisible = ref(true)
const bottomNavVisible = ref(true)

let lastScrollY = 0
let scrollStopTimer: ReturnType<typeof setTimeout> | null = null

const onMainScroll = () => {
  const el = mainScrollRef.value
  if (!el) return

  const y = el.scrollTop
  const delta = y - lastScrollY

  // Ignore micro-scrolls to prevent jitter
  if (Math.abs(delta) < 5) return

  // Only hide if we've scrolled down a bit past the header
  const scrollingDown = delta > 0 && y > 80

  mobileNavVisible.value = !scrollingDown
  bottomNavVisible.value = !scrollingDown
  lastScrollY = y

  // Auto-reveal bottom nav after user stops scrolling for 1.5s
  if (scrollStopTimer) clearTimeout(scrollStopTimer)
  if (scrollingDown) {
    scrollStopTimer = setTimeout(() => {
      bottomNavVisible.value = true
    }, 1500)
  }
}

// ─── MODAL CONTROLS ──────────────────────────────────────────────────────────
const showCreateModal = ref(false)
const showPostModal = ref(false)
const showStoryModal = ref(false)
const showQuickProductModal = ref(false)
const showSearchOverlay = ref(false)
const showNotificationOverlay = ref(false)
const showAI = ref(false)
const showCart = ref(false)
const dismissSellerBanner = ref(false)

const openPostUploader = () => {
  showCreateModal.value = false
  showPostModal.value = true
}
const openStoryUploader = () => {
  showCreateModal.value = false
  showStoryModal.value = true
}
const openQuickProductUploader = () => {
  showCreateModal.value = false
  showQuickProductModal.value = true
}

const handlePost = async () => {
  showPostModal.value = false
  showStoryModal.value = false
  showQuickProductModal.value = false

  // Refresh layout and feed data
  await Promise.all([
    refreshNuxtData('layout-data'),
    refreshNuxtData('homepage-main'),
    refreshNuxtData('profile-data'),
  ])
}

// ─── LIFECYCLE ───────────────────────────────────────────────────────────────
let refreshInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Refresh global layout data every 5 minutes (for notification counts, etc.)
  refreshInterval = setInterval(() => {
    refresh()
  }, 300000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (scrollStopTimer) clearTimeout(scrollStopTimer)
})
</script>

<style scoped>
/* Hide Scrollbar but keep functionality */
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Mobile Safe Area Adjustments */
@media (max-width: 767px) {
  .main-scroll {
    padding-top: max(4rem, calc(3.5rem + env(safe-area-inset-top, 0px)));
  }
  .main-scroll.has-category {
    padding-top: max(7rem, calc(7rem + env(safe-area-inset-top, 0px)));
  }
  .main-scroll > div {
    padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
  }
}

/* Seller Banner Transitions */
.seller-banner-enter-active {
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}
.seller-banner-leave-active {
  transition:
    transform 0.3s ease-in,
    opacity 0.3s ease-in;
}
.seller-banner-enter-from,
.seller-banner-leave-to {
  transform: translateY(150%);
  opacity: 0;
}
</style>
