<template>
    <HomeLayout :narrow-feed="true">
        <div class="w-full space-y-8">
            <!-- Loading Skeleton (Initial Load) -->
            <HomepageSkeleton v-if="pending && !mainFeed.length" />

            <!-- Error State -->
            <div v-else-if="error" class="flex flex-col items-center justify-center py-24 gap-4">
                <Icon name="mdi:wifi-off" size="48" class="text-gray-300 dark:text-neutral-600" />
                <p class="text-sm font-medium text-gray-500 dark:text-neutral-400">{{ $t('feed.loadError') }}</p>
                <button
                    @click="refresh()"
                    class="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-full hover:bg-[#d81b36] transition-colors"
                >
                    {{ $t('common.tryAgain') }}
                </button>
            </div>

            <!-- Content -->
            <div v-else>
                <!-- Stories Section -->
                <section v-if="profileStore.isLoggedIn" class="pb-2">
                    <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-4">
                        {{ $t('feed.todayInspo') }}
                    </h2>
                    <div class="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">

                        <!-- Add Story Button -->
                        <div class="flex flex-col items-center gap-2 shrink-0">
                            <button
                                @click="showUploadModal = true"
                                aria-label="Add your story"
                                class="story-ring p-[2px] rounded-full transition-transform hover:scale-105 active:scale-95"
                            >
                                <div class="w-[66px] h-[66px] rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
                                    <Icon name="mdi:plus-thick" size="22" class="text-brand" />
                                </div>
                            </button>
                            <span class="text-[11px] text-gray-500 dark:text-neutral-400 font-medium">{{ $t('feed.yourStory') }}</span>
                        </div>

                        <!-- Stories -->
                        <div
                            v-for="story in stories"
                            :key="story.id"
                            @click="router.push(`/stories/${story.id}`)"
                            class="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
                        >
                            <div class="story-ring p-[2px] rounded-full transition-transform group-hover:scale-105 group-active:scale-95">
                                <img
                                    :src="getMediaThumbnailUrl(story.media)"
                                    alt="Story"
                                    class="w-[66px] h-[66px] rounded-full object-cover ring-2 ring-white dark:ring-neutral-950"
                                />
                            </div>
                            <span class="text-[11px] text-center text-gray-500 dark:text-neutral-400 font-medium truncate w-[70px]">
                                {{ story.author?.username || 'User' }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-4 border-t border-gray-100 dark:border-neutral-800" />
                </section>

                <!-- Main Feed -->
                <section class="space-y-5 pt-2">
                    <template v-for="item in mainFeed" :key="item.id">
                        <ProductCard
                            v-if="item.type === 'PRODUCT' && item.product"
                            :product="item.product"
                            @open-comments="openCommentsModal"
                            @open-details="openProductModal"
                        />
                        <PostCard
                            v-else-if="item.type === 'POST'"
                            :post="item"
                            @open-comments="openPostCommentsModal"
                            @open-details="openPostModal"
                            @deleted="removeFromFeed"
                        />
                    </template>
                </section>

                <!-- Infinite Scroll Trigger -->
                <div ref="loadMoreTrigger" class="h-10" />

                <!-- Loading More Indicator -->
                <div v-if="feedStore.isLoading && mainFeed.length > 0" class="flex items-center justify-center gap-2 py-6">
                    <Icon name="eos-icons:loading" size="20" class="text-brand" />
                    <span class="text-xs text-gray-400 dark:text-neutral-500">{{ $t('common.loadingMore') }}</span>
                </div>
            </div>
        </div>

        <!-- Right Sidebar -->
        <template #right-sidebar>
            <RightSideNav 
               

            />
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
import { useRouter } from 'vue-router';

import { useFeedStore } from '../../layers/feed/app/stores/feed.stores';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import { useStory } from '~~/layers/feed/app/composables/useStory';


// Layouts & Components
import HomeLayout from '~/layouts/HomeLayout.vue';
import HomepageSkeleton from '~/components/home/HomePageSkeleton.vue';
import StoryUploadModal from '~/components/modals/StoryUploadModal.vue';
import PostDetailModal from '~~/layers/post/app/components/modals/PostDetailModal.vue';
import ProductDetailModal from '~/components/modals/ProductDetailModal.vue';
import PostCommentModal from '~/components/modals/PostCommentModal.vue';
import ProductCommentModal from '~/components/modals/ProductCommentModal.vue';
import ProductCard from '~/components/home/ProductCard.vue';

import PostCard from '../../layers/post/app/components/PostCard.vue'
import RightSideNav from '~/layouts/children/RightSideNav.vue';
import { useFeedApi } from '../../layers/feed/app/services/feed.api';
import { getMediaThumbnailUrl } from '../../layers/base/app/utils/formatters';
import type { IFeedItem } from '../../layers/feed/app/types/feed.types';
import type { IProduct } from '../../layers/post/app/types/post.types';

// Stores & Services
const router = useRouter();
const feedStore = useFeedStore();
const profileStore = useProfileStore();
const { stories: storyList, fetchStories } = useStory();

const feedApi = useFeedApi();

// Modal States
const commentProduct = ref<IProduct | null>(null);
const commentPost = ref<IFeedItem | null>(null);
const selectedProduct = ref<IProduct | null>(null);
const selectedPost = ref<IFeedItem | null>(null);
const showUploadModal = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

// 1. Fetch layout data (top sellers, categories)
//const { data: layoutData } = useLayoutData();
//const topSellers = computed(() => layoutData.value?.topSellers || []);

// 2. Fetch feed data — client-only to avoid a server→server HTTP call during SSR
// that would hang indefinitely. The skeleton shows briefly then data loads.
const { data: feedData, pending, error, refresh } = useLazyAsyncData(
    'homepage-main',
    () => feedApi.getHomeFeed({ limit: 20 }),
    {
        server: false,
        default: () => ({ items: [], meta: { total: 0, limit: 20, offset: 0, hasMore: false } } as any)
    }
);

// Sync Pinia feed store whenever data arrives or refreshes.
watch(feedData, (val) => {
    if (val?.items?.length) {
        feedStore.setInitialFeed(val.items, val.meta, 'main');
    }
}, { immediate: true });

// 3. Use computed properties for reactive data
const stories = storyList
const mainFeed = computed(() => feedStore.mainFeed?.length ? feedStore.mainFeed : (feedData.value?.items ?? []));
//const categories = computed(() => categoryStore.categories || []);

// 4. Infinite scroll setup
const loadMore = async () => {
    if (!feedStore.canLoadMore || feedStore.isLoading) return;
    
    try {
        const response = await feedApi.getHomeFeed({
            limit: 20,
            offset: feedStore.currentOffset
        });
        
        if (response && response.items) {
            feedStore.appendToFeed(response.items, response.meta, 'main');
        }
    } catch (error) {
        console.error('Failed to load more feed items:', error);
    }
};

onMounted(() => {
    // Load stories independently — failure must never block the feed
    fetchStories().catch(() => {});

    // Setup intersection observer for infinite scroll
    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting) {
                loadMore();
            }
        },
        { rootMargin: '200px' }
    );

    if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value);
    }
});

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
});

// Modal Handlers
const openCommentsModal = (product: IProduct) => {
    commentProduct.value = product;
};

const openPostCommentsModal = (post: IFeedItem) => {
    // Open full detail modal — PostDetails contains the comment thread
    selectedPost.value = post;
};

const openProductModal = (product: IProduct) => {
    selectedProduct.value = product;
};

const openPostModal = (post: IFeedItem) => {
    selectedPost.value = post;
};

const removeFromFeed = (postId: string) => {
    feedStore.removeItem(postId);
};

const handleStoryPosted = async () => {
    showUploadModal.value = false;
    await Promise.all([
        refreshNuxtData('homepage-main'),
        fetchStories().catch(() => {}),
    ]);
};
</script>

<style scoped>
.scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Gradient ring shared by story avatars and the Add Story button */
.story-ring {
    background: linear-gradient(135deg, #f02c56, #ff9a3c, #a855f7);
}
</style>