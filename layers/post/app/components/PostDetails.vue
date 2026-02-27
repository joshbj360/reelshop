<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Media -->
    <div class="bg-black flex items-center justify-center shrink-0" style="aspect-ratio: 4/5; max-height: 40vh;">
      <video
        v-if="isVideo"
        :src="mediaUrl!"
        class="w-full h-full object-contain"
        controls
        playsinline
      />
      <img
        v-else-if="mediaUrl"
        :src="mediaUrl"
        :alt="post.caption || 'Post'"
        class="w-full h-full object-contain"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="mdi:image-off-outline" size="48" class="text-neutral-600" />
      </div>
    </div>

    <!-- Author Header -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-neutral-800 shrink-0">
      <NuxtLink :to="`/@${post.author?.username}`" class="shrink-0">
        <img
          :src="post.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`"
          :alt="post.author?.username"
          class="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
        />
      </NuxtLink>
      <div class="flex-1 min-w-0">
        <NuxtLink
          :to="`/@${post.author?.username}`"
          class="font-semibold text-sm text-gray-900 dark:text-neutral-100 hover:underline"
        >
          {{ post.author?.username }}
        </NuxtLink>
        <p class="text-xs text-gray-500 dark:text-neutral-400">{{ timeAgo(post.createdAt || post.created_at) }}</p>
      </div>
      <FollowButton
        v-if="profileStore.userId && profileStore.userId !== post.authorId"
        :user-id="post.authorId"
        :username="post.author?.username || ''"
      />
    </div>

    <!-- Scrollable Comments Area -->
    <div ref="commentsContainer" class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      <!-- Caption as first comment -->
      <div v-if="post.caption" class="flex items-start gap-3">
        <img
          :src="post.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.username}`"
          class="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div class="flex-1">
          <p class="text-sm text-gray-900 dark:text-neutral-100">
            <NuxtLink :to="`/@${post.author?.username}`" class="font-semibold mr-1 hover:underline">
              {{ post.author?.username }}
            </NuxtLink>
            {{ post.caption }}
          </p>
          <p class="text-xs text-gray-500 dark:text-neutral-400 mt-1">
            {{ timeAgo(post.createdAt || post.created_at) }}
          </p>
        </div>
      </div>

      <!-- Loading comments -->
      <div v-if="isLoadingComments" class="flex justify-center py-4">
        <Icon name="eos-icons:loading" size="24" class="text-brand" />
      </div>

      <!-- Comments List -->
      <div v-for="comment in comments" :key="comment.id" class="flex items-start gap-3">
        <img
          :src="comment.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.author?.username}`"
          class="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div class="flex-1">
          <p class="text-sm text-gray-900 dark:text-neutral-100">
            <NuxtLink :to="`/@${comment.author?.username}`" class="font-semibold mr-1 hover:underline">
              {{ comment.author?.username }}
            </NuxtLink>
            {{ comment.text }}
          </p>
          <p class="text-xs text-gray-500 dark:text-neutral-400 mt-1">
            {{ timeAgo(comment.createdAt || comment.created_at) }}
          </p>
        </div>
      </div>

      <!-- Empty comments -->
      <div v-if="!isLoadingComments && !comments.length && !post.caption" class="text-center py-6 text-gray-400 dark:text-neutral-500 text-sm">
        No comments yet. Be the first!
      </div>
    </div>

    <!-- Actions + Add Comment (pinned bottom) -->
    <div class="border-t border-gray-200 dark:border-neutral-800 shrink-0">
      <!-- Action Buttons -->
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-5">
          <!-- Like -->
          <button @click="handleLike" class="group flex items-center gap-1.5 focus:outline-none">
            <Icon
              :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
              size="26"
              :class="isLiked ? 'text-brand' : 'text-gray-900 dark:text-neutral-100'"
              class="transition-transform group-active:scale-75"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ likeCount }}</span>
          </button>
          <!-- Comment -->
          <button @click="focusCommentInput" class="group flex items-center gap-1.5 focus:outline-none">
            <Icon name="mdi:chat-outline" size="26" class="text-gray-900 dark:text-neutral-100" />
            <span class="text-sm font-medium text-gray-900 dark:text-neutral-100">{{ post._count?.comments ?? comments.length }}</span>
          </button>
          <!-- Share -->
          <button @click="sharePost" class="group focus:outline-none">
            <Icon name="mdi:share-variant-outline" size="26" class="text-gray-900 dark:text-neutral-100" />
          </button>
        </div>
        <!-- Bookmark -->
        <button @click="handleSave" class="focus:outline-none">
          <Icon
            :name="isSaved ? 'mdi:bookmark' : 'mdi:bookmark-outline'"
            size="26"
            :class="isSaved ? 'text-brand' : 'text-gray-900 dark:text-neutral-100'"
          />
        </button>
      </div>

      <!-- Date -->
      <div class="px-4 pb-2">
        <p class="text-xs text-gray-500 dark:text-neutral-400">
          {{ formatDate(post.createdAt || post.created_at) }}
        </p>
      </div>

      <!-- Add Comment Form -->
      <form @submit.prevent="addComment" class="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-neutral-800">
        <img
          v-if="profileStore.avatar"
          :src="profileStore.avatar"
          class="w-7 h-7 rounded-full object-cover shrink-0"
        />
        <input
          ref="commentInputRef"
          v-model="commentText"
          type="text"
          placeholder="Add a comment..."
          class="flex-1 bg-transparent text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
        />
        <button
          type="submit"
          :disabled="!commentText.trim() || isPostingComment"
          class="text-brand font-semibold text-sm disabled:opacity-40 transition-opacity"
        >
          {{ isPostingComment ? '...' : 'Post' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePost } from '../composables/usePost'
import { useComment } from '../composables/useComment'
import { usePostStore } from '../store/post.store'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import FollowButton from '~~/layers/profile/app/components/FollowButton.vue'
import { notify } from '@kyvg/vue3-notification'
import type { IPost } from '../types/post.types'

const props = defineProps<{ post: IPost }>()

const { likePost, unlikePost, savePost, unsavePost } = usePost()
const { fetchPostComments, createComment } = useComment()
const postStore = usePostStore()
const profileStore = useProfileStore()

const comments = ref<any[]>([])
const commentText = ref('')
const isSaved = ref(false)
const isLoadingComments = ref(false)
const isPostingComment = ref(false)
const likeCount = ref<number>(props.post._count?.likes ?? props.post._count?.likes ?? 0)
const commentsContainer = ref<HTMLElement | null>(null)
const commentInputRef = ref<HTMLInputElement | null>(null)

const isLiked = computed(() => postStore.isPostLiked(props.post.id))

// Media helpers
const mediaUrl = computed(() => props.post.media?.[0]?.url || props.post.content || null)
const isVideo = computed(() => {
  const type = props.post.media?.[0]?.type
  const contentType = props.post.contentType
  return type === 'VIDEO' || (contentType && contentType.includes('video'))
})

onMounted(async () => {
  isLoadingComments.value = true
  try {
    const result = await fetchPostComments(props.post.id)
    comments.value = result?.data || []
  } catch {
    // silent
  } finally {
    isLoadingComments.value = false
  }
})

const handleLike = async () => {
  if (!profileStore.userId) {
    notify({ type: 'warn', text: 'Please log in to like posts' })
    return
  }
  try {
    if (isLiked.value) {
      await unlikePost(props.post.id)
      likeCount.value = Math.max(0, likeCount.value - 1)
    } else {
      await likePost(props.post.id)
      likeCount.value += 1
    }
  } catch {
    notify({ type: 'error', text: 'Failed to update like' })
  }
}

const handleSave = async () => {
  if (!profileStore.userId) {
    notify({ type: 'warn', text: 'Please log in to save posts' })
    return
  }
  try {
    if (isSaved.value) {
      await unsavePost(props.post.id)
      isSaved.value = false
    } else {
      await savePost(props.post.id)
      isSaved.value = true
    }
  } catch {
    notify({ type: 'error', text: 'Failed to update saved post' })
  }
}

const addComment = async () => {
  const text = commentText.value.trim()
  if (!text || isPostingComment.value) return
  if (!profileStore.userId) {
    notify({ type: 'warn', text: 'Please log in to comment' })
    return
  }
  isPostingComment.value = true
  try {
    const newComment = await createComment(props.post.id, { text })
    comments.value.push(newComment)
    commentText.value = ''
    // scroll to bottom
    await nextTick()
    if (commentsContainer.value) {
      commentsContainer.value.scrollTop = commentsContainer.value.scrollHeight
    }
  } catch {
    notify({ type: 'error', text: 'Failed to post comment' })
  } finally {
    isPostingComment.value = false
  }
}

const focusCommentInput = () => {
  commentInputRef.value?.focus()
}

const sharePost = async () => {
  const shareUrl = `${window.location.origin}/post/${props.post.id}`
  try {
    if (navigator.share) {
      await navigator.share({ url: shareUrl, title: props.post.caption || 'Check out this post' })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      notify({ type: 'success', text: 'Link copied!' })
    }
  } catch {}
}

const timeAgo = (date: string | Date) => {
  if (!date) return ''
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return `${Math.floor(seconds / 604800)}w`
}

const formatDate = (date: string | Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
