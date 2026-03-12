<template>
    <HomeLayout :narrow-feed="false" :hide-right-sidebar="true" :custom-padding="true">
        <!-- Full-screen snap scroll container -->
        <div
            ref="container"
            class="fixed inset-0 md:left-20 xl:left-72 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            @scroll.passive="onScroll"
        >
            <!-- Loading -->
            <div v-if="pending && !reels.length" class="h-[100dvh] flex items-center justify-center bg-black">
                <Icon name="eos-icons:loading" size="48" class="text-brand animate-spin" />
            </div>

            <!-- Error -->
            <div v-else-if="error && !reels.length" class="h-[100dvh] flex flex-col items-center justify-center bg-black gap-4">
                <p class="text-white/60">Could not load Reels.</p>
                <button @click="refresh()" class="px-6 py-2 bg-brand text-white rounded-full text-sm font-medium">Retry</button>
            </div>

            <!-- Empty -->
            <div v-else-if="!reels.length" class="h-[100dvh] flex flex-col items-center justify-center bg-black gap-3">
                <Icon name="mdi:video-off-outline" size="48" class="text-white/30" />
                <p class="text-white/50 text-sm">No reels yet</p>
            </div>

            <!-- Reels -->
            <template v-else>
                <div
                    v-for="(reel, index) in reels"
                    :key="reel.id"
                    class="snap-start snap-always reel-slide"
                    :data-index="index"
                >
                    <ReelItem
                        :reel="reel"
                        :is-active="index === activeIndex"
                        :index="index"
                        @open-comments="openComments"
                    />
                </div>

                <!-- Load more sentinel -->
                <div ref="sentinel" class="h-px bg-transparent" />
            </template>
        </div>

        <!-- Comments modal -->
        <PostDetailModal
            v-if="activeCommentReel"
            :post="activeCommentReel"
            @close="activeCommentReel = null"
        />
    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import ReelItem from '~/components/reels/ReelItem.vue'
import PostDetailModal from '~~/layers/post/app/components/modals/PostDetailModal.vue'
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types'
import { useFeed } from '~~/layers/feed/app/composables/useFeed'

const { fetchReels: fetchReelsApi } = useFeed()

useSeoMeta({ title: 'Reels · Styli', description: 'Watch fashion reels from creators and sellers.' })

const LIMIT = 10

const reels = ref<IFeedItem[]>([])
const activeIndex = ref(0)
const activeCommentReel = ref<IFeedItem | null>(null)
const container = ref<HTMLElement | null>(null)
const sentinel = ref<HTMLElement | null>(null)
const offset = ref(0)
const hasMore = ref(true)
const isFetching = ref(false)
const pending = ref(true)
const error = ref(false)

const fetchReels = async (reset = false) => {
    if (isFetching.value) return
    isFetching.value = true
    try {
        const res = await fetchReelsApi(LIMIT, reset ? 0 : offset.value)
        const incoming: IFeedItem[] = res?.data ?? []
        reels.value = reset ? incoming : [...reels.value, ...incoming]
        offset.value = reset ? LIMIT : offset.value + LIMIT
        hasMore.value = res?.meta?.hasMore ?? false
        error.value = false
    } catch {
        error.value = true
    } finally {
        isFetching.value = false
        pending.value = false
    }
}

const refresh = () => fetchReels(true)

// Snap scroll → derive active index
const onScroll = () => {
    if (!container.value) return
    const slideHeight = container.value.clientHeight
    activeIndex.value = Math.round(container.value.scrollTop / slideHeight)
}

// Infinite scroll via sentinel
// root must be the fixed scroll container, not the viewport (root: null)
let sentinelObserver: IntersectionObserver | null = null
const setupSentinel = () => {
    sentinelObserver?.disconnect()
    if (!sentinel.value || !container.value) return
    sentinelObserver = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting && hasMore.value && !isFetching.value) fetchReels()
    }, { root: container.value, threshold: 0 })
    sentinelObserver.observe(sentinel.value)
}

// Re-setup when either ref changes
watch([sentinel, container], setupSentinel)
onUnmounted(() => sentinelObserver?.disconnect())

onMounted(async () => {
    await fetchReels(true)
    // Setup after initial load so container is ready and sentinel is in the DOM
    nextTick(setupSentinel)
})
</script>

<style scoped>
.reel-slide {
    height: 100dvh;
    width: 100%;
}
.scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>