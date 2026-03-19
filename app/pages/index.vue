<!-- pages/index.vue -->
<template>
  <HomeLayout :narrow-feed="true">
    <div class="w-full space-y-4 px-2 sm:px-4">
      <!-- Loading Skeleton -->
      <HomepageSkeleton v-if="pending && !mainFeed.length" />

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center gap-5 py-32 text-center"
      >
        <div class="rounded-full bg-red-50/80 p-5 dark:bg-red-950/30">
          <Icon
            name="mdi:wifi-off"
            size="48"
            class="text-red-500 dark:text-red-400"
          />
        </div>
        <div>
          <p class="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            {{ $t('feed.loadError') }}
          </p>
          <p class="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            Please check your connection and try again.
          </p>
        </div>
        <button
          @click="refresh()"
          class="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand/90 hover:shadow-lg active:scale-95"
        >
          {{ $t('common.tryAgain') }}
        </button>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Stories Section (Logged-in users only) -->
        <section v-if="profileStore.isLoggedIn" class="pb-1">
          <h2
            class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-500"
          >
            {{ $t('feed.todayInspo') }}
          </h2>

          <div class="relative">
            <!-- Scroll Arrows -->
            <button
              v-if="storiesScrollLeft > 0"
              @click="scrollStories('left')"
              class="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-800"
            >
              <Icon
                name="mdi:chevron-left"
                size="20"
                class="text-gray-600 dark:text-neutral-300"
              />
            </button>

            <button
              v-if="storiesCanScrollRight"
              @click="scrollStories('right')"
              class="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-800"
            >
              <Icon
                name="mdi:chevron-right"
                size="20"
                class="text-gray-600 dark:text-neutral-300"
              />
            </button>

            <!-- Stories Scroller -->
            <div
              ref="storiesScroller"
              class="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
              @scroll="onStoriesScroll"
            >
              <!-- Add Story Button -->
              <div class="flex shrink-0 flex-col items-center gap-2">
                <button
                  @click="showUploadModal = true"
                  aria-label="Add your story"
                  class="story-ring flex h-[70px] w-[70px] items-center justify-center rounded-full p-1 transition-all hover:scale-105 active:scale-95"
                >
                  <div
                    class="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-neutral-900"
                  >
                    <Icon name="mdi:plus" size="28" class="text-brand" />
                  </div>
                </button>
                <span
                  class="text-xs font-medium text-gray-500 dark:text-neutral-400"
                >
                  {{ $t('feed.yourStory') }}
                </span>
              </div>

              <!-- User Stories -->
              <div
                v-for="story in stories"
                :key="story.id"
                @click="router.push(`/stories/${story.id}`)"
                class="group flex shrink-0 cursor-pointer flex-col items-center gap-2"
              >
                <div
                  class="story-ring flex h-[70px] w-[70px] items-center justify-center rounded-full p-1 transition-all group-hover:scale-105 group-active:scale-95"
                >
                  <img
                    :src="getMediaThumbnailUrl(story.media)"
                    :alt="story.author?.username || 'Story'"
                    class="h-full w-full rounded-full object-cover ring-2 ring-white dark:ring-neutral-950"
                  />
                </div>
                <span
                  class="w-[70px] truncate text-center text-xs font-medium text-gray-500 dark:text-neutral-400"
                >
                  {{ story.author?.username || 'User' }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Affiliate Program Banner (logged-in only) -->
        <section v-if="profileStore.isLoggedIn">
          <NuxtLink
            :to="`/profile/${profileStore.me?.username}?tab=affiliate`"
            class="group flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-4 shadow-md transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.99]"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20"
            >
              <Icon name="mdi:cash-multiple" size="26" class="text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-white">
                {{ $t('affiliate.joinTitle') }}
              </p>
              <p class="truncate text-[12px] text-white/80">
                {{ $t('affiliate.joinSubtitle') }}
              </p>
            </div>
            <div
              class="shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-[12px] font-bold text-white transition-colors group-hover:bg-white/30"
            >
              {{ $t('affiliate.enrollNow') }}
              <Icon name="mdi:arrow-right" size="14" class="ml-0.5 inline" />
            </div>
          </NuxtLink>
        </section>

        <!-- Main Feed -->
        <section class="space-y-6">
          <template v-for="item in mainFeed" :key="item.id">
            <ShopProductCard
              v-if="item.type === 'PRODUCT' && item.product"
              :product="item.product"
              @open-detail="openProductModal"
              @open-comments="commentProduct = $event"
              @market="marketProduct = $event"
            />
            <PostCard
              v-else-if="item.type === 'POST'"
              :post="item"
              @open-comments="openPostCommentsModal"
              @open-details="openPostModal"
              @deleted="removeFromFeed"
              @open-product="openProductById"
            />
          </template>
        </section>

        <!-- Infinite Scroll Trigger -->
        <div ref="loadMoreTrigger" class="h-16" />

        <!-- Loading More -->
        <div
          v-if="feedStore.isLoading && mainFeed.length > 0"
          class="flex items-center justify-center gap-3 py-8"
        >
          <div
            class="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent"
          />
          <span class="text-sm text-gray-500 dark:text-neutral-400">
            {{ $t('common.loadingMore') }}
          </span>
        </div>

        <!-- End of Feed Message -->
        <div
          v-if="
            !feedStore.canLoadMore &&
            mainFeed.length > 0 &&
            !feedStore.isLoading
          "
          class="py-12 text-center text-sm text-gray-500 dark:text-neutral-400"
        >
          You've reached the end ✨ Keep exploring!
        </div>
      </div>
    </div>

    <!-- Right Sidebar Slot -->
    <template #right-sidebar>
      <RightSideNav />
    </template>

    <!-- Modals -->
    <ProductCommentModal
      :is-open="!!commentProduct"
      :product="commentProduct"
      @close="commentProduct = null"
    />

    <PostCommentModal
      :is-open="!!commentPost"
      :post="commentPost"
      @close="commentPost = null"
    />

    <ProductDetailModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null"
      @open-comments="
        (p) => {
          commentProduct = p
          selectedProduct = null
        }
      "
    />

    <ProductMarketModal
      :is-open="!!marketProduct"
      :product="marketProduct"
      @close="marketProduct = null"
    />

    <PostDetailModal
      v-if="selectedPost"
      :post="selectedPost"
      @close="selectedPost = null"
    />

    <StoryUploadModal
      :is-open="showUploadModal"
      @close="showUploadModal = false"
      @posted="handleStoryPosted"
    />
  </HomeLayout>
</template>

<script setup lang="ts">
import { useRouter, useLazyAsyncData } from '#imports'

import HomeLayout from '~/layouts/HomeLayout.vue'
import HomepageSkeleton from '~/components/skeletons/HomePageSkeleton.vue'
import StoryUploadModal from '~/components/modals/StoryUploadModal.vue'
import ProductDetailModal from '~~/layers/commerce/app/components/modals/ProductDetailModal.vue'
import PostDetailModal from '~~/layers/post/app/components/modals/PostDetailModal.vue'
import ProductMarketModal from '~~/layers/commerce/app/components/modals/ProductMarketModal.vue'
import PostCommentModal from '~~/layers/post/app/components/modals/PostCommentModal.vue'
import ProductCommentModal from '~~/layers/commerce/app/components/modals/ProductCommentModal.vue'
import ShopProductCard from '~/components/shop/ShopProductCard.vue'
import PostCard from '~~/layers/post/app/components/PostCard.vue'
import RightSideNav from '~/layouts/children/RightSideNav.vue'

import { useProductApi } from '~~/layers/commerce/app/services/product.api'
import { useFeedApi } from '~~/layers/feed/app/services/feed.api'
import { useFeedStore } from '~~/layers/feed/app/stores/feed.stores'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types'
import type { IProduct } from '~~/layers/post/app/types/post.types'

const router = useRouter()
const feedStore = useFeedStore()
const profileStore = useProfileStore()
const { stories, fetchStories } = useStory()

// SEO
useSeo().setHomePage()

// States
const commentProduct = ref<IProduct | null>(null)
const commentPost = ref<IFeedItem | null>(null)
const selectedProduct = ref<IProduct | null>(null)
const marketProduct = ref<IProduct | null>(null)
const selectedPost = ref<IFeedItem | null>(null)
const showUploadModal = ref(false)

// Stories scroller refs & state
const storiesScroller = ref<HTMLElement | null>(null)
const storiesScrollLeft = ref(0)
const storiesCanScrollRight = ref(false)

const onStoriesScroll = () => {
  if (!storiesScroller.value) return
  storiesScrollLeft.value = storiesScroller.value.scrollLeft
  storiesCanScrollRight.value =
    storiesScroller.value.scrollLeft + storiesScroller.value.clientWidth <
    storiesScroller.value.scrollWidth - 10
}

const scrollStories = (dir: 'left' | 'right') => {
  if (!storiesScroller.value) return
  storiesScroller.value.scrollBy({
    left: dir === 'left' ? -240 : 240,
    behavior: 'smooth',
  })
}

// Feed loading (client-only)
const {
  data: feedData,
  pending,
  error,
  refresh,
} = useLazyAsyncData(
  'homepage-main',
  () => useFeedApi().getHomeFeed({ limit: 20 }),
  { server: false },
)

watch(
  feedData,
  (val) => {
    if (val?.items?.length) {
      feedStore.setInitialFeed(val.items, val.meta, 'main')
    }
  },
  { immediate: true },
)

const mainFeed = computed(() =>
  feedStore.mainFeed?.length ? feedStore.mainFeed : feedData.value?.items ?? [],
)

// Infinite scroll
const loadMoreTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const loadMore = async () => {
  if (!feedStore.canLoadMore || feedStore.isLoading) return
  await feedStore.loadMore('main')
}

onMounted(() => {
  if (profileStore.isLoggedIn) {
    fetchStories()
      .catch(() => {})
      .then(() => nextTick(onStoriesScroll))
  }

  observer.value = new IntersectionObserver(
    (entries) => entries[0]?.isIntersecting && loadMore(),
    { rootMargin: '300px' },
  )

  if (loadMoreTrigger.value) observer.value.observe(loadMoreTrigger.value)
})

onUnmounted(() => observer.value?.disconnect())

// Modal handlers
const openPostCommentsModal = (post: IFeedItem) => {
  selectedPost.value = post
}

const openProductModal = (product: IProduct) => {
  selectedProduct.value = product
}

const openProductById = async (id: number) => {
  try {
    const res = await useProductApi().getProductById(id)
    selectedProduct.value = res?.data
  } catch {}
}

const openPostModal = (post: IFeedItem) => {
  selectedPost.value = post
}

const removeFromFeed = (postId: string) => {
  feedStore.removeItem(postId)
}

const handleStoryPosted = async () => {
  showUploadModal.value = false
  await Promise.all([refresh(), fetchStories().catch(() => {})])
}
</script>

<style scoped>
.story-ring {
  background: linear-gradient(135deg, #f02c56, #ff9a3c, #a855f7, #9333ea);
  padding: 3px;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
