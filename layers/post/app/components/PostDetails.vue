<template>
    <div class="flex flex-col h-full overflow-hidden">
        <!-- Share modal -->
        <ShareModal
            :is-open="showShareModal"
            :url="shareUrl"
            :title="post.caption || 'Check out this post'"
            @close="showShareModal = false"
        />

        <!-- ── Author header ──────────────────────────────────────────── -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-neutral-800 shrink-0">
            <NuxtLink :to="`/profile/${post.author?.username}`" class="shrink-0">
                <Avatar
                    :username="post.author?.username ?? 'User'"
                    :avatar="post.author?.avatar ?? ''"
                    size="md"
                />
            </NuxtLink>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <NuxtLink
                        :to="`/profile/${post.author?.username}`"
                        class="font-semibold text-[13px] text-gray-900 dark:text-neutral-100 hover:opacity-75 transition-opacity"
                    >
                        {{ post.author?.username }}
                    </NuxtLink>
                    <!-- Content-type badge -->
                    <span
                        class="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full text-[9px] font-bold uppercase tracking-widest select-none"
                        :class="badgeClass"
                    >
                        <Icon :name="badgeIcon" size="9" />
                        {{ contentTypeLabel }}
                    </span>
                </div>
                <p class="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5">
                    {{ timeAgo(post.created_at) }}
                </p>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <FollowButton
                    v-if="profileStore.userId && profileStore.userId !== post.author?.id"
                    :user-id="post.author!.id"
                    :username="post.author?.username || ''"
                />
                <!-- Close button -->
                <button
                    @click="$emit('close')"
                    class="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors ml-1"
                    aria-label="Close"
                >
                    <Icon name="mdi:close" size="18" />
                </button>
            </div>
        </div>

        <!-- ── Scrollable content: caption + comments ─────────────────── -->
        <div ref="commentsContainer" class="flex-1 overflow-y-auto min-h-0">
            <div class="p-4 space-y-4">

                <!-- Caption block -->
                <div v-if="cleanCaption || post.content" class="flex items-start gap-3">
                    <NuxtLink :to="`/profile/${post.author?.username}`" class="shrink-0">
                        <Avatar
                            :username="post.author?.username ?? 'User'"
                            :avatar="post.author?.avatar ?? ''"
                            size="sm"
                        />
                    </NuxtLink>
                    <div class="flex-1 min-w-0">
                        <!-- INSPIRATION: quote style -->
                        <div
                            v-if="post.contentType === 'INSPIRATION'"
                            class="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border-l-3 border-amber-400"
                        >
                            <p class="text-[13px] italic text-gray-900 dark:text-neutral-100 leading-relaxed">
                                <span class="font-semibold not-italic mr-1">{{ post.author?.username }}</span>
                                {{ cleanCaption || post.content }}
                            </p>
                        </div>
                        <!-- Default caption -->
                        <p v-else class="text-[13px] text-gray-900 dark:text-neutral-100 leading-relaxed">
                            <span class="font-semibold mr-1">{{ post.author?.username }}</span>
                            {{ cleanCaption || post.content }}
                        </p>
                        <!-- Hashtags -->
                        <p v-if="hashtags.length" class="mt-1 text-[12px]">
                            <span
                                v-for="(tag, i) in hashtags"
                                :key="i"
                                class="text-brand dark:text-pink-400 font-medium mr-1.5"
                            >{{ tag }}</span>
                        </p>
                        <p class="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
                            {{ timeAgo(post.created_at) }}
                        </p>
                    </div>
                </div>

                <!-- Audio player (AUDIO media type) -->
                <div v-if="post.media?.type === 'AUDIO'" class="rounded-xl overflow-hidden">
                    <AudioPlayer :src="post.media.url" />
                </div>

                <!-- Tagged products (COMMERCE) -->
                <div v-if="hasTaggedProducts" class="rounded-xl border border-emerald-100 dark:border-emerald-900/50 p-3">
                    <div class="flex items-center gap-1 mb-2">
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

                <!-- Divider before comments -->
                <div v-if="comments.length || isLoadingComments" class="border-t border-gray-100 dark:border-neutral-800" />

                <!-- Loading comments -->
                <div v-if="isLoadingComments" class="flex justify-center py-4">
                    <Icon name="eos-icons:loading" size="22" class="text-brand" />
                </div>

                <!-- Comments -->
                <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="flex items-start gap-3 group/comment"
                >
                    <Avatar
                        :username="comment.author?.username ?? 'User'"
                        :avatar="comment.author?.avatar ?? ''"
                        size="sm"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-[13px] text-gray-900 dark:text-neutral-100 leading-relaxed">
                            <NuxtLink
                                :to="`/profile/${comment.author?.username}`"
                                class="font-semibold mr-1 hover:opacity-75 transition-opacity"
                            >{{ comment.author?.username }}</NuxtLink>
                            {{ comment.text }}
                        </p>
                        <div class="flex items-center gap-3 mt-1">
                            <p class="text-[11px] text-gray-400 dark:text-neutral-500">
                                {{ timeAgo(comment.createdAt || comment.created_at) }}
                            </p>
                            <button class="text-[11px] font-semibold text-gray-400 dark:text-neutral-500 hover:text-gray-600">{{ $t('post.reply') }}</button>
                        </div>
                    </div>
                    <!-- Comment like -->
                    <button
                        @click="handleCommentLike(comment)"
                        class="shrink-0 flex flex-col items-center gap-0.5 pt-0.5 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                    >
                        <Icon
                            :name="comment._liked ? 'mdi:heart' : 'mdi:heart-outline'"
                            size="14"
                            :class="comment._liked ? 'text-red-500' : 'text-gray-400 dark:text-neutral-500'"
                        />
                        <span v-if="(comment._likeCount ?? 0) > 0" class="text-[9px] text-gray-400">{{ comment._likeCount }}</span>
                    </button>
                </div>

                <!-- Empty state -->
                <div
                    v-if="!isLoadingComments && !comments.length && !cleanCaption && !post.content"
                    class="flex flex-col items-center justify-center py-8 text-center"
                >
                    <Icon name="mdi:comment-outline" size="32" class="text-gray-300 dark:text-neutral-600 mb-2" />
                    <p class="text-[13px] text-gray-400 dark:text-neutral-500">{{ $t('post.noComments') }}</p>
                    <p class="text-[12px] text-gray-300 dark:text-neutral-600">{{ $t('post.beFirstComment') }}</p>
                </div>
            </div>
        </div>

        <!-- ── Pinned bottom: actions + comment input ─────────────────── -->
        <div class="border-t border-gray-100 dark:border-neutral-800 shrink-0">

            <!-- Action bar -->
            <div class="flex items-center justify-between px-4 py-2.5">
                <div class="flex items-center gap-0.5">
                    <!-- Like -->
                    <button
                        @click="handleLike"
                        class="group flex items-center gap-1 p-2 rounded-full focus:outline-none"
                        :aria-label="isLiked ? 'Unlike' : 'Like'"
                    >
                        <Icon
                            :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
                            size="24"
                            class="transition-all duration-150 group-active:scale-75"
                            :class="isLiked ? 'text-red-500' : 'text-gray-900 dark:text-neutral-100'"
                        />
                        <span class="text-[13px] font-medium text-gray-700 dark:text-neutral-300">{{ likeCount }}</span>
                    </button>
                    <!-- Comment -->
                    <button
                        @click="focusCommentInput"
                        class="group flex items-center gap-1 p-2 rounded-full focus:outline-none"
                    >
                        <Icon name="mdi:comment-outline" size="22" class="text-gray-900 dark:text-neutral-100 group-active:scale-75 transition-transform" />
                        <span class="text-[13px] font-medium text-gray-700 dark:text-neutral-300">{{ post.commentCount }}</span>
                    </button>
                    <!-- Share -->
                    <button @click="sharePost" class="group p-2 rounded-full focus:outline-none">
                        <Icon name="mdi:send-outline" size="21" class="text-gray-900 dark:text-neutral-100 -rotate-12 group-active:scale-75 transition-transform" />
                    </button>
                </div>
                <!-- Bookmark -->
                <button @click="handleSave" class="group p-2 rounded-full focus:outline-none">
                    <Icon
                        :name="isSaved ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
                        size="24"
                        class="group-active:scale-75 transition-all"
                        :class="isSaved ? 'text-brand' : 'text-gray-900 dark:text-neutral-100'"
                    />
                </button>
            </div>

            <!-- Like count + date -->
            <div class="px-5 pb-1.5">
                <p v-if="likeCount > 0" class="text-[13px] font-semibold text-gray-900 dark:text-neutral-100">
                    {{ likeCount.toLocaleString() }} {{ likeCount === 1 ? $t('post.like') : $t('post.likes') }}
                </p>
                <p class="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-600 mt-0.5">
                    {{ formatDate(post.created_at) }}
                </p>
            </div>

            <!-- Emoji picker panel -->
            <div v-if="showEmojiPicker" class="px-4 py-2 border-t border-gray-100 dark:border-neutral-800 flex flex-wrap gap-1.5">
                <button
                    v-for="e in EMOJIS"
                    :key="e"
                    @click="commentText += e"
                    class="text-lg hover:scale-125 transition-transform active:scale-95"
                >{{ e }}</button>
            </div>

            <!-- Comment input -->
            <form
                @submit.prevent="addComment"
                class="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-neutral-800"
            >
                <Avatar
                    :username="profileStore.me?.username ?? 'User'"
                    :avatar="profileStore.me?.avatar ?? ''"
                    size="sm"
                />
                <input
                    ref="commentInputRef"
                    v-model="commentText"
                    type="text"
                    :placeholder="$t('post.addComment')"
                    class="flex-1 bg-transparent text-[13px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
                />
                <!-- Emoji toggle -->
                <button
                    type="button"
                    @click="showEmojiPicker = !showEmojiPicker"
                    class="text-gray-400 hover:text-yellow-500 transition-colors shrink-0"
                    aria-label="Emoji"
                >
                    <Icon :name="showEmojiPicker ? 'mdi:emoticon' : 'mdi:emoticon-outline'" size="20" />
                </button>
                <button
                    type="submit"
                    :disabled="!commentText.trim() || isPostingComment"
                    class="text-brand font-semibold text-[13px] disabled:opacity-40 transition-opacity shrink-0"
                >
                    {{ isPostingComment ? '…' : $t('post.post') }}
                </button>
            </form>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { usePost } from '../composables/usePost';
import { useComment } from '../composables/useComment';
import { usePostStore } from '../store/post.store';
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store';
import FollowButton from '~~/layers/profile/app/components/FollowButton.vue';
import TaggedProductsDisplay from './TaggedProductsDisplay.vue';
import Avatar from '~~/layers/profile/app/components/Avatar.vue';
import AudioPlayer from './AudioPlayer.vue';
import { notify } from '@kyvg/vue3-notification';
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types';

const { t } = useI18n();

const props = defineProps<{ post: IFeedItem }>();
const emit = defineEmits(['close']);

const { likePost, unlikePost, savePost, unsavePost } = usePost();
const { fetchPostComments, createComment, likeComment, unlikeComment } = useComment();
const postStore = usePostStore();
const profileStore = useProfileStore();

const comments = ref<any[]>([]);
const commentText = ref('');
const isSaved = ref(postStore.savedPostIds.includes(props.post.id));
const isLoadingComments = ref(false);
const isPostingComment = ref(false);
const likeCount = ref(props.post.likeCount ?? 0);
const commentsContainer = ref<HTMLElement | null>(null);
const commentInputRef = ref<HTMLInputElement | null>(null);
const showEmojiPicker = ref(false);
const showShareModal = ref(false);
const shareUrl = computed(() => `${import.meta.client ? window.location.origin : ''}/post/${props.post.id}`);

const EMOJIS = ['😂','❤️','🔥','😍','👏','😭','🙏','💯','✨','😎','🥰','😊','🤣','😅','💪','🤩','😩','🥺','😤','👀','💀','🫶','🤍','💕','🎉','👑','💃','🛍️','✅','🤯'];

const isLiked = computed(() => postStore.isPostLiked(props.post.id));

// ── Content-type system (mirrors PostCard) ────────────────────────────────────
const CONTENT_TYPE_MAP: Record<string, { label: string; icon: string; accent: string; badge: string }> = {
    EXPERIENCE:    { label: 'Experience', icon: 'mdi:star-outline',      accent: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    INSPIRATION:   { label: 'Inspire',    icon: 'mdi:lightbulb-outline', accent: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    COMMERCE:      { label: 'Shop',       icon: 'mdi:shopping-outline',  accent: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    EDUCATIONAL:   { label: 'Learn',      icon: 'mdi:school-outline',    accent: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
    ENTERTAINMENT: { label: 'Fun',        icon: 'mdi:music-note',        accent: 'bg-pink-500',    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
};

const contentTypeDef = computed(() =>
    CONTENT_TYPE_MAP[props.post.contentType] ?? {
        label: props.post.contentType,
        icon: 'mdi:tag-outline',
        accent: 'bg-gray-300',
        badge: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400',
    }
);
const contentTypeLabel = computed(() => contentTypeDef.value.label);
const badgeIcon = computed(() => contentTypeDef.value.icon);
const badgeClass = computed(() => contentTypeDef.value.badge);

// ── Caption & hashtags ────────────────────────────────────────────────────────
const cleanCaption = computed(() => {
    if (!props.post.caption) return '';
    const stripped = props.post.caption.replace(/#\w+/g, '').trim();
    if (typeof document !== 'undefined') {
        const tmp = document.createElement('div');
        tmp.innerHTML = stripped;
        return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
    }
    return stripped.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
});

const hashtags = computed(() => props.post.caption?.match(/#\w+/g) || []);

// ── Tagged products ───────────────────────────────────────────────────────────
const taggedProducts = computed(() => props.post.taggedProducts || []);
const hasTaggedProducts = computed(() => taggedProducts.value.length > 0);

// ── Load comments ─────────────────────────────────────────────────────────────
onMounted(async () => {
    isLoadingComments.value = true;
    try {
        const result = await fetchPostComments(props.post.id);
        // Spread to break shared reference with Pinia store — prevents double-push on addComment
        comments.value = [...(result?.data || [])];
    } catch {
        // silent
    } finally {
        isLoadingComments.value = false;
    }
});

// ── Actions ───────────────────────────────────────────────────────────────────
const handleLike = async () => {
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToLike') });
        return;
    }
    try {
        if (isLiked.value) {
            await unlikePost(props.post.id);
            likeCount.value = Math.max(0, likeCount.value - 1);
        } else {
            await likePost(props.post.id);
            likeCount.value += 1;
        }
    } catch {
        notify({ type: 'error', text: t('errors.failedLike') });
    }
};

const handleSave = async () => {
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToSave') });
        return;
    }
    try {
        if (isSaved.value) {
            await unsavePost(props.post.id);
            isSaved.value = false;
        } else {
            await savePost(props.post.id);
            isSaved.value = true;
        }
    } catch {
        notify({ type: 'error', text: t('errors.failedSave') });
    }
};

const addComment = async () => {
    const text = commentText.value.trim();
    if (!text || isPostingComment.value) return;
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToComment') });
        return;
    }
    isPostingComment.value = true;
    try {
        const newComment = await createComment(props.post.id, { text });
        comments.value.push(newComment);
        commentText.value = '';
        await nextTick();
        if (commentsContainer.value) {
            commentsContainer.value.scrollTop = commentsContainer.value.scrollHeight;
        }
    } catch {
        notify({ type: 'error', text: t('errors.failedComment') });
    } finally {
        isPostingComment.value = false;
    }
};

const focusCommentInput = () => {
    commentInputRef.value?.focus()
    showEmojiPicker.value = false
};

const handleCommentLike = async (comment: any) => {
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToLike') });
        return;
    }
    const wasLiked = comment._liked;
    comment._liked = !wasLiked;
    comment._likeCount = (comment._likeCount ?? 0) + (wasLiked ? -1 : 1);
    try {
        if (wasLiked) await unlikeComment(props.post.id, comment.id)
        else await likeComment(props.post.id, comment.id)
    } catch {
        comment._liked = wasLiked;
        comment._likeCount = (comment._likeCount ?? 0) + (wasLiked ? 1 : -1);
    }
};

const sharePost = () => {
    if (navigator.share) {
        navigator.share({ url: shareUrl.value, title: props.post.caption || 'Check out this post' }).catch(() => {
            showShareModal.value = true
        })
    } else {
        showShareModal.value = true
    }
};

const timeAgo = (date: Date | string) => {
    if (!date) return '';
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
};

const formatDate = (date: Date | string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
</script>
