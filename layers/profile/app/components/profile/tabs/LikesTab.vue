<template>
    <div class="p-4">
        <!-- Skeleton -->
        <div v-if="isLoading && likedPosts.length === 0" class="grid grid-cols-3 gap-0.5">
            <div v-for="i in 9" :key="i" class="aspect-square bg-gray-100 dark:bg-neutral-800 animate-pulse rounded-sm" />
        </div>

        <!-- Empty -->
        <div v-else-if="likedPosts.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
            <Icon name="mdi:heart-outline" size="56" class="text-gray-300 dark:text-neutral-700" />
            <p class="text-[14px] text-gray-500 dark:text-neutral-400">No liked posts yet</p>
            <p class="text-[12px] text-gray-400 dark:text-neutral-500">Posts you like will appear here</p>
        </div>

        <!-- Grid -->
        <div v-else>
            <div class="grid grid-cols-3 gap-0.5">
                <button
                    v-for="post in likedPosts"
                    :key="post.id"
                    @click="openPost(post)"
                    class="aspect-square relative group overflow-hidden bg-gray-100 dark:bg-neutral-800 rounded-sm"
                >
                    <img
                        v-if="firstMedia(post)?.type === 'IMAGE'"
                        :src="firstMedia(post)!.url"
                        :alt="post.caption || 'Liked post'"
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <video
                        v-else-if="firstMedia(post)?.type === 'VIDEO'"
                        :src="firstMedia(post)!.url"
                        class="w-full h-full object-cover"
                        muted
                        preload="none"
                    />
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center p-3"
                        :class="contentTypeGradient(post.contentType)"
                    >
                        <p class="text-[11px] text-white font-medium line-clamp-4 text-center leading-relaxed">
                            {{ post.caption || post.content || '…' }}
                        </p>
                    </div>

                    <!-- Hover overlay -->
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <div class="flex items-center gap-1 text-white drop-shadow">
                            <Icon name="mdi:heart" size="20" />
                            <span class="text-[13px] font-semibold">{{ formatNum(post._count?.likes || 0) }}</span>
                        </div>
                        <div class="flex items-center gap-1 text-white drop-shadow">
                            <Icon name="mdi:comment" size="20" />
                            <span class="text-[13px] font-semibold">{{ formatNum(post._count?.comments || 0) }}</span>
                        </div>
                    </div>

                    <!-- Heart indicator -->
                    <div class="absolute top-1.5 right-1.5 pointer-events-none">
                        <Icon name="mdi:heart" size="16" class="text-red-400 drop-shadow-lg" />
                    </div>
                </button>
            </div>

            <!-- Load more -->
            <div v-if="hasMore" class="flex justify-center mt-4">
                <button
                    @click="loadMore"
                    :disabled="isLoading"
                    class="px-6 py-2 text-[13px] text-brand font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                >
                    {{ isLoading ? 'Loading…' : 'Load more' }}
                </button>
            </div>
        </div>

        <!-- Post detail modal -->
        <PostDetailModal
            v-if="selectedPost"
            :post="selectedPost"
            @close="selectedPost = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePostStore } from '~~/layers/post/app/store/post.store';
import { usePost } from '~~/layers/post/app/composables/usePost';
import PostDetailModal from '~~/layers/post/app/components/modals/PostDetailModal.vue';
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types';

const props = defineProps<{ username: string }>();

const postStore = usePostStore();
const { fetchUserLikedPosts, isLoading, normalizePost } = usePost();

const selectedPost = ref<IFeedItem | null>(null);
const hasMore = ref(false);
const offset = ref(0);
const LIMIT = 20;

const likedPosts = computed(() => postStore.getLikedPostsByUsername(props.username));

onMounted(async () => {
    if (likedPosts.value.length === 0) await loadPosts();
});

async function loadPosts() {
    const result = await fetchUserLikedPosts(props.username, LIMIT, offset.value);
    hasMore.value = result?.meta?.hasMore ?? false;
}

const loadMore = async () => {
    offset.value += LIMIT;
    await loadPosts();
};

const firstMedia = (post: any) =>
    Array.isArray(post.media) ? (post.media[0] ?? null) : (post.media ?? null);

const openPost = (post: any) => {
    selectedPost.value = normalizePost(post);
};

const formatNum = (n: number) =>
    n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : n.toString();

const contentTypeGradient = (type?: string) => {
    const map: Record<string, string> = {
        EXPERIENCE:    'bg-gradient-to-br from-blue-500 to-blue-700',
        INSPIRATION:   'bg-gradient-to-br from-amber-400 to-amber-600',
        COMMERCE:      'bg-gradient-to-br from-emerald-500 to-emerald-700',
        EDUCATIONAL:   'bg-gradient-to-br from-orange-500 to-orange-700',
        ENTERTAINMENT: 'bg-gradient-to-br from-pink-500 to-pink-700',
    };
    return map[type ?? ''] ?? 'bg-gradient-to-br from-gray-400 to-gray-600';
};
</script>
