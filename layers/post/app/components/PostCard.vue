<template>
    <article ref="cardRef" class="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden w-full">

        <!-- ─── Content-type accent stripe ──────────────────────────────── -->
        <div class="h-[3px] w-full" :class="accentBgClass" />

        <!-- ─── Header ──────────────────────────────────────────────────── -->
        <div class="flex items-center justify-between px-3 py-2.5">
            <div class="flex items-center gap-2 min-w-0">
                <NuxtLink :to="`/profile/${post.author?.username}`" class="shrink-0">
                    <Avatar
                        :username="post.author?.username ?? 'User'"
                        :avatar="post.author?.avatar ?? ''"
                        size="sm"
                    />
                </NuxtLink>
                <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <NuxtLink
                            :to="`/profile/${post.author?.username}`"
                            class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 leading-tight hover:opacity-75 transition-opacity"
                        >
                            {{ post.author?.username }}
                        </NuxtLink>
                        <!-- Content type badge -->
                        <span
                            class="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full text-[9px] font-bold uppercase tracking-widest select-none"
                            :class="badgeClass"
                        >
                            <Icon :name="badgeIcon" size="9" />
                            {{ contentTypeLabel }}
                        </span>
                        <!-- Follow button (only on others' posts) -->
                        <template v-if="profileStore.userId && post.author && profileStore.userId !== post.author.id">
                            <span class="text-gray-300 dark:text-neutral-600 text-xs select-none">·</span>
                            <FollowButton :user-id="post.author.id" :username="post.author?.username" />
                        </template>
                    </div>
                </div>
            </div>
            <!-- ─── Owner actions menu ──────────────────────────────── -->
            <div v-if="isOwner" class="relative ml-1 shrink-0">
                <button
                    @click.stop="menuOpen = !menuOpen"
                    class="p-1 text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors rounded-full"
                >
                    <Icon name="mdi:dots-horizontal" size="20" />
                </button>
                <div
                    v-if="menuOpen"
                    class="absolute right-0 top-8 z-20 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden min-w-[140px]"
                    @click.stop
                >
                    <button
                        @click="openEdit"
                        class="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <Icon name="mdi:pencil-outline" size="16" />
                        {{ $t('post.editPost') }}
                    </button>
                    <button
                        @click="handleDelete"
                        class="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <Icon name="mdi:delete-outline" size="16" />
                        {{ $t('post.deletePost') }}
                    </button>
                </div>
            </div>
            <button v-else class="p-1 text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors rounded-full ml-1 shrink-0">
                <Icon name="mdi:dots-horizontal" size="20" />
            </button>
        </div>

        <!-- ─── Text-only body ───────────────────────────────────────────── -->
        <template v-if="!hasMedia && (cleanCaption || post.content)">
            <!-- INSPIRATION: quote-style card -->
            <div
                v-if="post.contentType === 'INSPIRATION'"
                class="mx-3 mb-3 px-4 pt-3 pb-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 cursor-pointer"
                @click="$emit('open-details', post)"
            >
                <Icon name="mdi:format-quote-open" size="20" class="text-amber-400 mb-1" />
                <p class="text-[15px] leading-relaxed font-medium text-gray-900 dark:text-neutral-100 italic whitespace-pre-wrap"
                   :class="isTextLong && !textExpanded ? 'line-clamp-6' : ''">
                    {{ cleanCaption || post.content }}
                </p>
                <button
                    v-if="isTextLong && !textExpanded"
                    class="text-[12px] text-amber-500 mt-1"
                    @click.stop="textExpanded = true"
                >{{ $t('common.more') }}</button>
            </div>

            <!-- EDUCATIONAL: step/learn style -->
            <div
                v-else-if="post.contentType === 'EDUCATIONAL'"
                class="mx-3 mb-3 px-4 pt-3 pb-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 cursor-pointer"
                @click="$emit('open-details', post)"
            >
                <p class="text-[14px] leading-relaxed text-gray-900 dark:text-neutral-100 whitespace-pre-wrap"
                   :class="isTextLong && !textExpanded ? 'line-clamp-6' : ''">
                    {{ cleanCaption || post.content }}
                </p>
                <button
                    v-if="isTextLong && !textExpanded"
                    class="text-[12px] text-orange-500 mt-1"
                    @click.stop="textExpanded = true"
                >{{ $t('common.more') }}</button>
            </div>

            <!-- Default text (EXPERIENCE, ENTERTAINMENT, COMMERCE, etc.) -->
            <div
                v-else
                class="px-3 pb-2 cursor-pointer"
                @click="$emit('open-details', post)"
            >
                <p class="text-[14px] leading-relaxed text-gray-900 dark:text-neutral-100 whitespace-pre-wrap"
                   :class="isTextLong && !textExpanded ? 'line-clamp-6' : ''">
                    {{ cleanCaption || post.content }}
                </p>
                <button
                    v-if="isTextLong && !textExpanded"
                    class="text-[12px] text-gray-400 dark:text-neutral-500 mt-0.5"
                    @click.stop="textExpanded = true"
                >{{ $t('common.more') }}</button>
            </div>
        </template>

        <!-- ─── Media (full-bleed) ───────────────────────────────────────── -->
        <div v-if="hasMedia" class="w-full relative">

            <!-- ── Single VIDEO ── -->
            <div
                v-if="primaryMedia?.type === 'VIDEO'"
                class="relative w-full overflow-hidden bg-black cursor-pointer"
                :style="videoContainerStyle"
                @click="$emit('open-details', post)"
            >
                <video
                    ref="videoRef"
                    :src="primaryMedia.url"
                    :poster="primaryMedia.thumbnailUrl"
                    class="w-full h-full object-cover"
                    loop
                    playsinline
                />
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Icon name="mdi:play" size="26" class="text-white ml-0.5" />
                    </div>
                </div>
                <button
                    @click.stop="toggleMute"
                    class="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto hover:bg-black/70 transition-colors"
                >
                    <Icon :name="videoMuted ? 'mdi:volume-off' : 'mdi:volume-high'" size="16" class="text-white" />
                </button>
            </div>

            <!-- ── Standalone AUDIO ── -->
            <div v-else-if="primaryMedia?.type === 'AUDIO'" class="px-3 pt-1 pb-2">
                <AudioPlayer :src="primaryMedia.url" />
            </div>

            <!-- ── Single IMAGE ── -->
            <div
                v-else-if="mediaItems.length === 1 && primaryMedia?.type === 'IMAGE'"
                class="relative w-full overflow-hidden bg-gray-100 dark:bg-neutral-900 cursor-pointer"
                :style="imageContainerStyle"
                @click="$emit('open-details', post)"
            >
                <img v-if="imageLoaded" :src="primaryMedia.url" class="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-30 pointer-events-none select-none" aria-hidden="true" />
                <img :src="primaryMedia.url" :alt="post.caption || 'Post image'" class="relative w-full h-full object-contain transition-opacity duration-300" :class="imageLoaded ? 'opacity-100' : 'opacity-0'" @load="onImageLoad" @error="onImageError" />
                <div v-if="!imageLoaded && !imageError" class="absolute inset-0 animate-pulse bg-gray-200 dark:bg-neutral-800" />
            </div>

            <!-- ── MULTI-IMAGE COLLAGE ── -->
            <div v-else-if="mediaItems.length > 1" class="w-full cursor-pointer" @click="$emit('open-details', post)">
                <!-- 2: side by side -->
                <div v-if="mediaItems.length === 2" class="grid grid-cols-2 gap-0.5">
                    <div v-for="item in mediaItems" :key="item.id" class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                        <img :src="item.url" class="w-full h-full object-cover" :alt="post.caption || ''" />
                        <div v-if="item.type === 'VIDEO'" class="absolute inset-0 flex items-center justify-center">
                            <div class="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"><Icon name="mdi:play" size="18" class="text-white ml-0.5" /></div>
                        </div>
                    </div>
                </div>
                <!-- 3: 1 tall left + 2 stacked right -->
                <div v-else-if="mediaItems.length === 3" class="grid grid-cols-2 gap-0.5">
                    <div class="relative overflow-hidden bg-gray-100 dark:bg-neutral-900" style="aspect-ratio: 4/5;">
                        <img :src="mediaItems[0]!.url" class="w-full h-full object-cover" />
                    </div>
                    <div class="grid grid-rows-2 gap-0.5">
                        <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900"><img :src="mediaItems[1]!.url" class="w-full h-full object-cover" /></div>
                        <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900"><img :src="mediaItems[2]!.url" class="w-full h-full object-cover" /></div>
                    </div>
                </div>
                <!-- 4: 2×2 grid -->
                <div v-else-if="mediaItems.length === 4" class="grid grid-cols-2 gap-0.5">
                    <div v-for="item in mediaItems" :key="item.id" class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                        <img :src="item.url" class="w-full h-full object-cover" :alt="post.caption || ''" />
                    </div>
                </div>
                <!-- 5+: 1 big top + row of 2 with +N badge -->
                <div v-else class="grid grid-cols-2 gap-0.5">
                    <div class="col-span-2 relative overflow-hidden bg-gray-100 dark:bg-neutral-900 aspect-video">
                        <img :src="mediaItems[0]!.url" class="w-full h-full object-cover" />
                    </div>
                    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                        <img :src="mediaItems[1]!.url" class="w-full h-full object-cover" />
                    </div>
                    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900">
                        <img :src="mediaItems[2]!.url" class="w-full h-full object-cover" />
                        <div v-if="mediaItems.length > 3" class="absolute inset-0 bg-black/55 flex items-center justify-center">
                            <span class="text-white text-xl font-bold">+{{ mediaItems.length - 3 }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- COMMERCE badge -->
            <div v-if="post.contentType === 'COMMERCE'" class="absolute top-2 left-2 pointer-events-none">
                <span class="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                    <Icon name="mdi:shopping-outline" size="11" />{{ $t('contentType.COMMERCE') }}
                </span>
            </div>

            <!-- ── Background music strip ── -->
            <div v-if="post.bgMusic" class="absolute bottom-0 inset-x-0 z-10 pointer-events-none">
                <!-- Soft gradient fade -->
                <div class="h-14 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <!-- Content row -->
                <div class="bg-gradient-to-r from-black/80 to-black/50 px-3 pb-3 pt-1 flex items-center gap-2.5">
                    <!-- Spinning vinyl disc -->
                    <div class="vinyl-disc shrink-0" :class="{ spinning: musicPlaying }">
                        <div class="vinyl-hole" />
                    </div>
                    <!-- Track name -->
                    <div class="flex-1 min-w-0">
                        <p class="text-[9px] text-white/50 font-medium uppercase tracking-widest leading-none mb-[3px]">
                            <Icon name="mdi:music-note" size="9" class="inline -mt-0.5" /> {{ $t('music.backgroundMusic') }}
                        </p>
                        <div class="overflow-hidden">
                            <!-- Duplicate text creates seamless loop -->
                            <span v-if="shouldScrollMusic" class="marquee-text text-[11px] text-white font-semibold leading-tight inline-block">
                                {{ musicDisplayName }}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{{ musicDisplayName }}
                            </span>
                            <span v-else class="text-[11px] text-white font-semibold leading-tight truncate block">
                                {{ musicDisplayName }}
                            </span>
                        </div>
                    </div>
                    <!-- Equalizer bars -->
                    <div class="eq-bars shrink-0" :class="{ playing: musicPlaying }">
                        <div class="eq-bar" style="--h: 40%; --d: 0s" />
                        <div class="eq-bar" style="--h: 100%; --d: 0.12s" />
                        <div class="eq-bar" style="--h: 65%; --d: 0.07s" />
                        <div class="eq-bar" style="--h: 85%; --d: 0.18s" />
                        <div class="eq-bar" style="--h: 50%; --d: 0.03s" />
                    </div>
                </div>
            </div>

        </div>

        <!-- Hidden background-music audio element -->
        <audio v-if="post.bgMusic" ref="musicRef" :src="post.bgMusic.url" loop preload="none" />

        <!-- ─── Action Bar ────────────────────────────────────────────────── -->
        <div class="px-2 pt-1">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <!-- Like -->
                    <button
                        @click.stop="handleLike"
                        class="group p-2 rounded-full focus:outline-none"
                        :aria-label="localIsLiked ? 'Unlike' : 'Like'"
                    >
                        <Icon
                            :name="localIsLiked ? 'mdi:heart' : 'mdi:heart-outline'"
                            size="25"
                            class="transition-all duration-150 group-active:scale-75"
                            :class="localIsLiked ? 'text-red-500' : 'text-gray-900 dark:text-neutral-100'"
                        />
                    </button>
                    <!-- Comment -->
                    <button
                        @click.stop="$emit('open-comments', post)"
                        class="group p-2 rounded-full focus:outline-none"
                        aria-label="Comment"
                    >
                        <Icon
                            name="mdi:comment-outline"
                            size="23"
                            class="text-gray-900 dark:text-neutral-100 group-active:scale-75 transition-transform"
                        />
                    </button>
                    <!-- Share -->
                    <button
                        @click.stop="sharePost"
                        class="group p-2 rounded-full focus:outline-none"
                        aria-label="Share"
                    >
                        <Icon
                            name="mdi:send-outline"
                            size="22"
                            class="text-gray-900 dark:text-neutral-100 group-active:scale-75 transition-transform -rotate-12"
                        />
                    </button>
                </div>
                <!-- Bookmark -->
                <button
                    @click.stop="handleBookmark"
                    class="group p-2 rounded-full focus:outline-none"
                    :aria-label="isBookmarked ? 'Remove bookmark' : 'Save'"
                >
                    <Icon
                        :name="isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                        size="25"
                        class="text-gray-900 dark:text-neutral-100 group-active:scale-75 transition-all"
                    />
                </button>
            </div>

            <!-- Like count -->
            <p v-if="localLikeCount > 0" class="px-1 text-[13px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug">
                {{ localLikeCount.toLocaleString() }} {{ localLikeCount === 1 ? $t('post.like') : $t('post.likes') }}
            </p>

            <!-- Caption (media posts) -->
            <div v-if="hasMedia && (cleanCaption || post.content)" class="px-1 mt-0.5">
                <p class="text-[13px] text-gray-900 dark:text-neutral-100 leading-snug">
                    <NuxtLink
                        :to="`/profile/${post.author?.username}`"
                        class="font-semibold mr-1 hover:opacity-75 transition-opacity"
                    >{{ post.author?.username }}</NuxtLink>
                    <span
                        class="cursor-pointer"
                        :class="isCaptionLong && !textExpanded ? 'line-clamp-2' : ''"
                        @click.stop="$emit('open-details', post)"
                    >{{ cleanCaption || post.content }}</span>
                    <button
                        v-if="isCaptionLong && !textExpanded"
                        class="text-gray-400 dark:text-neutral-500 ml-0.5"
                        @click.stop="textExpanded = true"
                    >{{ $t('common.more') }}</button>
                </p>
            </div>

            <!-- Hashtags -->
            <p v-if="hashtags.length > 0" class="px-1 mt-0.5 text-[13px]">
                <span
                    v-for="(tag, i) in hashtags"
                    :key="i"
                    class="text-brand dark:text-pink-400 font-medium mr-1.5 cursor-pointer hover:opacity-75"
                >{{ tag }}</span>
            </p>

            <!-- View all comments -->
            <button
                v-if="post.commentCount > 0"
                @click.stop="$emit('open-comments', post)"
                class="px-1 mt-0.5 text-[12px] text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors block"
            >
                {{ $t('post.viewAll') }} {{ post.commentCount }} {{ post.commentCount === 1 ? $t('post.comment') : $t('post.comments') }}
            </button>

            <!-- Tagged Products (commerce shop strip) -->
            <div v-if="hasTaggedProducts" class="px-1 mt-2">
                <div class="flex items-center gap-1 mb-1">
                    <Icon name="mdi:shopping-outline" size="13" class="text-emerald-500" />
                    <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        {{ $t('post.shopThisPost') }}
                    </span>
                </div>
                <TaggedProductsDisplay
                    :products="taggedProducts"
                    :content-type="post.contentType"
                />
            </div>

            <!-- Timestamp -->
            <p class="px-1 mt-1 pb-2.5 text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-600">
                {{ timeAgo(post?.created_at) }}
            </p>
        </div>

    </article>

    <!-- Edit modal (mounted outside article to avoid z-index issues) -->
    <PostEditModal
        v-if="showEditModal"
        :post="post"
        @close="showEditModal = false"
        @updated="onPostUpdated"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePost } from '../composables/usePost';
import { usePostStore } from '../store/post.store';
import { notify } from '@kyvg/vue3-notification';
import FollowButton from '~~/layers/profile/app/components/FollowButton.vue';
import TaggedProductsDisplay from './TaggedProductsDisplay.vue';
import PostEditModal from './modals/PostEditModal.vue';
import AudioPlayer from './AudioPlayer.vue';
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import Avatar from '~~/layers/profile/app/components/Avatar.vue';

const { t } = useI18n();

const props = defineProps<{ post: IFeedItem }>();
const emit = defineEmits(['open-comments', 'open-details', 'deleted']);

const profileStore = useProfileStore();
const postStore = usePostStore();
const { likePost, unlikePost, savePost, unsavePost, deletePost } = usePost();
const cardRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const musicRef = ref<HTMLAudioElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const musicObserver = ref<IntersectionObserver | null>(null);
const musicPlaying = ref(false);

// ─── Like & Bookmark ──────────────────────────────────────────────────────────
const localIsLiked = ref(postStore.isPostLiked(props.post.id));
const localLikeCount = ref(props.post.likeCount || 0);
const isBookmarked = ref(postStore.savedPostIds.includes(props.post.id));

// ─── Owner / menu ─────────────────────────────────────────────────────────────
const isOwner = computed(() => !!profileStore.userId && profileStore.userId === props.post.author?.id);
const menuOpen = ref(false);
const showEditModal = ref(false);

const openEdit = () => { menuOpen.value = false; showEditModal.value = true; };

const handleDelete = async () => {
    menuOpen.value = false;
    if (!confirm(t('post.confirmDelete'))) return;
    try {
        await deletePost(props.post.id);
        emit('deleted', props.post.id);
        notify({ type: 'success', text: t('post.deleted') });
    } catch {
        notify({ type: 'error', text: t('errors.failedDelete') });
    }
};

const onPostUpdated = (updates: any) => {
    // The store is already updated by updatePost; caption in the local feed item
    // will reflect on next render via the store. Nothing extra needed.
};

// Close menu when clicking outside
const closeMenu = () => { menuOpen.value = false; };
onMounted(() => document.addEventListener('click', closeMenu));
onUnmounted(() => document.removeEventListener('click', closeMenu));

// ─── Text expand ──────────────────────────────────────────────────────────────
const textExpanded = ref(false);

// ─── Image dimension tracking ─────────────────────────────────────────────────
const imageNaturalWidth = ref(0);
const imageNaturalHeight = ref(0);
const imageLoaded = ref(false);
const imageError = ref(false);

// ─── Media helpers ────────────────────────────────────────────────────────────
// Use mediaItems array (multi-media) when available, fall back to legacy single media
const mediaItems = computed(() =>
    (props.post.mediaItems && props.post.mediaItems.length > 0)
        ? props.post.mediaItems
        : (props.post.media ? [props.post.media] : [])
);
const primaryMedia = computed(() => mediaItems.value[0]);
const hasMedia = computed(() => mediaItems.value.length > 0);

// ─── Background music helpers ─────────────────────────────────────────────────
const musicDisplayName = computed(() => {
    const name = props.post.bgMusic?.name;
    if (!name) return 'Background Music';
    // Strip extension and prettify
    return name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
});
const shouldScrollMusic = computed(() => musicDisplayName.value.length > 22);

// ─── Content type system ──────────────────────────────────────────────────────
const CONTENT_TYPE_MAP: Record<string, {
    icon: string;
    accent: string;
    badge: string;
}> = {
    EXPERIENCE:    { icon: 'mdi:star-outline',      accent: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    INSPIRATION:   { icon: 'mdi:lightbulb-outline', accent: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    COMMERCE:      { icon: 'mdi:shopping-outline',  accent: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    EDUCATIONAL:   { icon: 'mdi:school-outline',    accent: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
    ENTERTAINMENT: { icon: 'mdi:music-note',        accent: 'bg-pink-500',    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
};

const contentTypeDef = computed(() => CONTENT_TYPE_MAP[props.post.contentType] ?? {
    icon: 'mdi:tag-outline',
    accent: 'bg-gray-300 dark:bg-neutral-700',
    badge: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400',
});

const contentTypeLabel = computed(() =>
    t(`contentType.${props.post.contentType}`, props.post.contentType)
);
const badgeIcon = computed(() => contentTypeDef.value.icon);
const accentBgClass = computed(() => contentTypeDef.value.accent);
const badgeClass = computed(() => contentTypeDef.value.badge);

// ─── Image aspect ratio ───────────────────────────────────────────────────────
// Clamp between 4:5 (portrait) and 1:1 (square). Landscape → square with blurred fill.
const imageContainerStyle = computed(() => {
    if (!imageLoaded.value || imageNaturalWidth.value === 0) {
        return { aspectRatio: '4 / 5' };
    }
    const natural = imageNaturalWidth.value / imageNaturalHeight.value;
    const clamped = Math.min(1.0, Math.max(0.8, natural));
    return { aspectRatio: `${clamped}` };
});

// ─── Video aspect ratio ───────────────────────────────────────────────────────
const videoContainerStyle = computed(() => ({
    aspectRatio: '9 / 16',
    maxHeight: '75vh',
}));

const onImageLoad = (e: Event) => {
    const img = e.target as HTMLImageElement;
    imageNaturalWidth.value = img.naturalWidth;
    imageNaturalHeight.value = img.naturalHeight;
    imageLoaded.value = true;
};

const onImageError = () => {
    imageError.value = true;
    imageLoaded.value = true;
};

// ─── Caption ──────────────────────────────────────────────────────────────────
const cleanCaption = computed(() => {
    if (!props.post.caption) return '';
    const withoutHashtags = props.post.caption.replace(/#\w+/g, '').trim();
    if (typeof document !== 'undefined') {
        const temp = document.createElement('div');
        temp.innerHTML = withoutHashtags;
        return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
    }
    return withoutHashtags.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
});

const hashtags = computed(() => props.post.caption?.match(/#\w+/g) || []);
const isCaptionLong = computed(() => ((props.post.caption?.length ?? 0) + (props.post.content?.length ?? 0)) > 120);
const isTextLong = computed(() => (props.post.content?.length ?? 0) > 200);

// ─── Tagged products ──────────────────────────────────────────────────────────
const taggedProducts = computed(() => props.post.taggedProducts || []);
const hasTaggedProducts = computed(() => taggedProducts.value.length > 0);

// ─── Actions ──────────────────────────────────────────────────────────────────
const handleLike = async () => {
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToLike') });
        return;
    }
    const wasLiked = localIsLiked.value;
    localIsLiked.value = !wasLiked;
    localLikeCount.value += wasLiked ? -1 : 1;
    try {
        if (wasLiked) await unlikePost(props.post.id);
        else await likePost(props.post.id);
    } catch {
        localIsLiked.value = wasLiked;
        localLikeCount.value += wasLiked ? 1 : -1;
        notify({ type: 'error', text: t('errors.failedLike') });
    }
};

const handleBookmark = async () => {
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToSave') });
        return;
    }
    const wasSaved = isBookmarked.value;
    isBookmarked.value = !wasSaved;
    try {
        if (wasSaved) await unsavePost(props.post.id);
        else await savePost(props.post.id);
    } catch {
        isBookmarked.value = wasSaved;
        notify({ type: 'error', text: t('errors.failedSave') });
    }
};

const sharePost = async () => {
    const shareUrl = `${window.location.origin}/post/${props.post.id}`;
    try {
        if (navigator.share) {
            await navigator.share({ url: shareUrl, title: props.post.caption || 'Check out this post' });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            notify({ type: 'success', text: t('post.linkCopied') });
        }
    } catch {
        notify({ type: 'error', text: t('errors.failedShare') });
    }
};

const timeAgo = (date: Date | string) => {
    if (!date) return '';
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return t('time.justNow');
    if (s < 3600) return t('time.minutesAgo', { n: Math.floor(s / 60) });
    if (s < 86400) return t('time.hoursAgo', { n: Math.floor(s / 3600) });
    return t('time.daysAgo', { n: Math.floor(s / 86400) });
};

// ─── Video mute toggle ────────────────────────────────────────────────────────
const videoMuted = ref(true);
const toggleMute = () => {
    videoMuted.value = !videoMuted.value;
    if (videoRef.value) videoRef.value.muted = videoMuted.value;
};

// ─── Video + Music autoplay on scroll ─────────────────────────────────────────
onMounted(() => {
    // Video observer
    if (videoRef.value) {
        videoRef.value.muted = true;
        observer.value = new IntersectionObserver(
            ([entry]) => {
                if (entry!.isIntersecting) videoRef.value?.play().catch(() => {});
                else videoRef.value?.pause();
            },
            { threshold: 0.5 }
        );
        observer.value.observe(videoRef.value);
    }

    // Music observer — watches the whole card
    if (props.post.bgMusic && cardRef.value) {
        musicObserver.value = new IntersectionObserver(
            ([entry]) => {
                if (entry!.isIntersecting) {
                    musicRef.value?.play().catch(() => {});
                    musicPlaying.value = true;
                } else {
                    musicRef.value?.pause();
                    musicPlaying.value = false;
                }
            },
            { threshold: 0.5 }
        );
        musicObserver.value.observe(cardRef.value);
    }
});

onUnmounted(() => {
    observer.value?.disconnect();
    musicObserver.value?.disconnect();
    musicRef.value?.pause();
});
</script>

<style scoped>
/* ── Vinyl disc ─────────────────────────────────────────────────── */
.vinyl-disc {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: conic-gradient(
        #1c1c1c 0deg, #333 45deg, #1c1c1c 90deg,
        #2a2a2a 135deg, #1c1c1c 180deg,
        #333 225deg, #1c1c1c 270deg,
        #2a2a2a 315deg, #1c1c1c 360deg
    );
    border: 1.5px solid rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 3px rgba(244,114,182,0.15), inset 0 0 8px rgba(0,0,0,0.6);
}
.vinyl-disc.spinning {
    animation: vinylSpin 3s linear infinite;
}
.vinyl-hole {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, #fb7185, #e11d48);
    box-shadow: 0 0 6px rgba(244,114,182,0.9);
}

/* ── Equalizer bars ─────────────────────────────────────────────── */
.eq-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 16px;
}
.eq-bar {
    width: 3px;
    height: var(--h);
    background: linear-gradient(to top, #f43f5e, #fb923c);
    border-radius: 2px;
    transition: height 0.4s ease;
}
.eq-bars.playing .eq-bar {
    animation: eqBounce 0.65s ease-in-out var(--d) infinite alternate;
}

/* ── Marquee text ───────────────────────────────────────────────── */
.marquee-text {
    animation: marquee 9s linear infinite;
    padding-right: 3rem;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes vinylSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
@keyframes eqBounce {
    from { height: 18%; }
    to   { height: var(--h); }
}
@keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>
